import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Res,
  UseGuards,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { RagService } from './rag/rag.service';
import { TtsService } from './tts/tts.service';
import { LectureService } from './lecture/lecture.service';
import { VideoService } from './video/video.service';
import { PoemsService } from '../poems/poems.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('ai')
export class AiController {
  constructor(
    private aiService: AiService,
    private ragService: RagService,
    private ttsService: TtsService,
    private lectureService: LectureService,
    private videoService: VideoService,
    private poemsService: PoemsService,
  ) {}

  // ========== RAG 问答 ==========

  @Public()
  @Post('chat')
  async chat(
    @Body('question') question: string,
    @Body('poemId') poemId?: number,
  ) {
    let poemContext: string | undefined;
    if (poemId) {
      const poem = await this.poemsService.findById(poemId);
      poemContext = `《${poem.title}》- ${poem.author}：${poem.content}`;
    }
    const answer = await this.ragService.ask(question, poemContext);
    return { answer };
  }

  // ========== TTS 朗读 ==========

  @Public()
  @Get('tts/voices')
  getVoices() {
    return this.ttsService.getVoices();
  }

  @Public()
  @Post('tts/:poemId')
  async generateTts(
    @Param('poemId') poemId: number,
    @Body('voice') voice?: string,
    @Body('speed') speed?: number,
    @Body('style') style?: 'normal' | 'ancient' | 'emotional',
  ) {
    const poem = await this.poemsService.findById(poemId);
    const audio = await this.ttsService.generateSpeech(poem.content, {
      voice,
      speed,
      style,
    });
    return { audioBase64: audio.toString('base64') };
  }

  @Public()
  @Get('tts/:poemId/stream')
  async streamTts(
    @Param('poemId') poemId: number,
    @Query('voice') voice: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const poem = await this.poemsService.findById(poemId);
    const audio = await this.ttsService.generateSpeech(poem.content, {
      voice: voice || undefined,
    });
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `inline; filename="${poem.title}.mp3"`,
    });
    return new StreamableFile(audio);
  }

  // ========== AI 讲解 ==========

  @Public()
  @Post('lecture/:poemId')
  async generateLecture(@Param('poemId') poemId: number) {
    const poem = await this.poemsService.findById(poemId);
    return this.lectureService.generateLecture(poem);
  }

  @Public()
  @Get('lecture/:poemId/stream')
  async streamLecture(
    @Param('poemId') poemId: number,
    @Query('chapter') chapter: number,
    @Res() res: Response,
  ) {
    const poem = await this.poemsService.findById(poemId);
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const stream = this.lectureService.generateLectureStream(poem, chapter || 0);
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  }

  // ========== AI 视频 ==========

  @Public()
  @Get('video/templates')
  getVideoTemplates() {
    return this.videoService.getTemplates();
  }

  @Public()
  @Post('video/:poemId/generate')
  async generateVideo(
    @Param('poemId') poemId: number,
    @Body('template') template?: string,
  ) {
    const poem = await this.poemsService.findById(poemId);
    return this.videoService.generateVideo(poem, template);
  }

  @Public()
  @Get('video/:poemId/status')
  getVideoStatus(@Param('poemId') poemId: number, @Query('taskId') taskId: string) {
    return this.videoService.getTaskStatus(taskId);
  }

  // ========== AI 推荐 ==========

  @Public()
  @Get('recommendations')
  async getRecommendations(@Query('poemId') poemId?: number) {
    const poem = poemId
      ? await this.poemsService.findById(poemId)
      : await this.poemsService.getDaily();

    const systemPrompt = '你是一位精通中国古典诗词的专家。';
    const userPrompt = `我最近在读《${poem.title}》（${poem.author}）。请推荐5首风格或意境相似的中国古典诗词，每首附上一句推荐理由。只返回JSON数组：[{"title":"...","author":"...","reason":"..."}]`;

    const response = await this.aiService.generateText(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 1000,
    });

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return { recommendations: JSON.parse(jsonMatch[0]), basedOn: poem.title };
      }
    } catch {}

    return { recommendations: [], basedOn: poem.title };
  }

  // ========== AI 对联 ==========

  @Public()
  @Post('couplet')
  async generateCouplet(@Body('firstLine') firstLine: string) {
    const response = await this.aiService.generateText(
      '你是一位楹联大师，精通对联创作。请根据上联生成工整的下联。只返回下联，不要其他内容。',
      `上联：${firstLine}\n下联：`,
      { temperature: 0.9, maxTokens: 200 },
    );
    return { firstLine, secondLine: response.trim() };
  }

  // ========== AI 续写 ==========

  @Public()
  @Post('continue')
  async continuePoem(
    @Body('lines') lines: string,
    @Body('style') style?: string,
  ) {
    const response = await this.aiService.generateText(
      `你是一位才华横溢的诗人。请续写以下诗句，保持${style || '古典'}风格和格律。只返回续写的内容，不要解释。`,
      `已有诗句：${lines}\n续写：`,
      { temperature: 0.9, maxTokens: 300 },
    );
    return { original: lines, continuation: response.trim() };
  }
}
