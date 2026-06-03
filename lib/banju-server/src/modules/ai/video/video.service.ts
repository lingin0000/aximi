import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { TtsService } from '../tts/tts.service';

export interface VideoTask {
  id: string;
  poemId: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  errorMessage?: string;
  createdAt: Date;
}

interface StoryboardScene {
  index: number;
  description: string;
  duration: number;
  transition: string;
}

/**
 * AI 视频生成服务
 *
 * 简化实现：生成分镜脚本 + 标记任务状态
 * 实际视频生成需要对接：
 *   - 文生图 API (DALL·E / Stable Diffusion)
 *   - 图生视频 API (Runway / Pika)
 *   - FFmpeg 合成
 *
 * 本服务完成第一步（脚本生成），后续步骤通过异步任务队列执行
 */
@Injectable()
export class VideoService {
  private tasks: Map<string, VideoTask> = new Map();
  private templates = [
    { id: 'ink', name: '水墨丹青', description: '传统水墨画风格，意境悠远', icon: '🎨' },
    { id: 'landscape', name: '山水画卷', description: '壮丽山水景色，大气磅礴', icon: '🏔️' },
    { id: 'flower', name: '花鸟虫鱼', description: '精致花鸟细节，生机盎然', icon: '🌸' },
    { id: 'snow', name: '雪夜寒梅', description: '冬日雪景，清冷高雅', icon: '❄️' },
    { id: 'modern', name: '现代水墨', description: '古今融合的现代风格', icon: '🌆' },
  ];

  constructor(
    private aiService: AiService,
    private ttsService: TtsService,
  ) {}

  getTemplates() {
    return this.templates;
  }

  /**
   * 触发视频生成
   * 返回任务 ID，客户端轮询查询进度
   */
  async generateVideo(
    poem: { id: number; title: string; author: string; dynasty: string; content: string },
    templateId: string = 'ink',
  ): Promise<{ taskId: string }> {
    const taskId = `video_${Date.now()}_${poem.id}`;
    const task: VideoTask = {
      id: taskId,
      poemId: poem.id,
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
    };
    this.tasks.set(taskId, task);

    // Start async generation
    this.processVideo(taskId, poem, templateId).catch((err) => {
      const t = this.tasks.get(taskId);
      if (t) {
        t.status = 'failed';
        t.errorMessage = err.message;
      }
    });

    return { taskId };
  }

  /**
   * 查询视频生成进度
   */
  getTaskStatus(taskId: string): VideoTask | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * 执行视频生成流程（简化版）
   */
  private async processVideo(
    taskId: string,
    poem: { id: number; title: string; author: string; dynasty: string; content: string },
    templateId: string,
  ) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    // Step 1: Generate storyboard script (10%)
    task.progress = 10;
    const storyboard = await this.generateStoryboard(poem);

    // Step 2: Simulate image generation (30%)
    task.progress = 30;
    const imagePrompts = storyboard.map((s) => s.description);

    // Step 3: Simulate TTS generation (50%)
    task.progress = 50;
    // In production: actually generate TTS audio
    // const audioBuffer = await this.ttsService.generateSpeech(poem.content);

    // Step 4: Simulate video composition (80%)
    task.progress = 80;

    // Step 5: Finalize (100%)
    task.progress = 100;
    task.status = 'completed';
    task.resultUrl = `/api/ai/video/${poem.id}?template=${templateId}`; // placeholder

    console.log(`[Video] Task ${taskId} completed for poem "${poem.title}"`);
  }

  /**
   * 使用 LLM 生成分镜脚本
   */
  private async generateStoryboard(
    poem: { title: string; author: string; dynasty: string; content: string },
  ): Promise<StoryboardScene[]> {
    const prompt = `你是一位专业的短视频导演。请为以下唐诗/宋词生成一个30秒短视频的分镜脚本。
每句诗对应一个分镜，描述画面内容、时长(秒)、转场方式。

诗词：
标题：《${poem.title}》
作者：${poem.author}（${poem.dynasty}）
内容：
${poem.content}

请以JSON格式返回（只返回JSON，不要其他内容）：
[
  {
    "index": 1,
    "description": "画面描述（中文，50字以内，适合文生图AI理解）",
    "duration": 5,
    "transition": "fade"
  }
]`;

    const response = await this.aiService.generateText(
      '你是专业视频导演，只输出JSON格式的分镜脚本。',
      prompt,
      { temperature: 0.7, maxTokens: 2000 },
    );

    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse storyboard JSON, using fallback');
    }

    // Fallback: simple storyboard splitting lines
    const lines = poem.content.split('\n').filter((l) => l.trim());
    return lines.map((line, i) => ({
      index: i + 1,
      description: `古风画面：${line}，${poem.title}诗词意境，中式水墨风格`,
      duration: Math.max(3, Math.min(8, Math.floor(30 / lines.length))),
      transition: i < lines.length - 1 ? 'fade' : 'none',
    }));
  }
}
