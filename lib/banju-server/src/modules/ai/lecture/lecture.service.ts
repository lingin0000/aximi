import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { RagService } from '../rag/rag.service';

interface LectureChapter {
  title: string;
  content: string;
  order: number;
}

export interface LectureResult {
  poemId: number;
  poemTitle: string;
  chapters: LectureChapter[];
  totalDuration?: number;
}

/**
 * AI 虚拟讲师 — 生成多维度诗词深度讲解
 */
@Injectable()
export class LectureService {
  constructor(
    private aiService: AiService,
    private ragService: RagService,
  ) {}

  /**
   * 生成完整讲解（返回结构化章节）
   */
  async generateLecture(
    poem: { id: number; title: string; author: string; dynasty: string; content: string; translation?: string; appreciation?: string },
  ): Promise<LectureResult> {
    const chapters: LectureChapter[] = [];

    const chapterConfigs = [
      {
        title: '创作背景',
        prompt: `请详细讲解《${poem.title}》的创作背景，包括：诗人${poem.author}的生平简介、创作此诗时的历史环境和个人遭遇。`,
        order: 1,
      },
      {
        title: '逐句解析',
        prompt: `请逐句解析《${poem.title}》的每一句诗，包括白话翻译、深层含义和艺术手法。
诗词全文：
${poem.content}`,
        order: 2,
      },
      {
        title: '格律分析',
        prompt: `请分析《${poem.title}》的格律特点，包括：平仄规律、对仗技巧、押韵方式、用字精妙之处。`,
        order: 3,
      },
      {
        title: '意象解读',
        prompt: `请深入解读《${poem.title}》中的核心意象，分析它们的象征意义和文化内涵，以及诗人如何通过这些意象传达情感。`,
        order: 4,
      },
      {
        title: '情感脉络',
        prompt: `请分析《${poem.title}》的情感脉络——全诗情感如何起伏变化，从开头到结尾情感是如何层层推进的。`,
        order: 5,
      },
      {
        title: '比较阅读',
        prompt: `请将《${poem.title}》与同时代或同主题的其他诗词进行对比分析，指出它的独特之处和在文学史上的地位。`,
        order: 6,
      },
    ];

    const systemPrompt = `你是一位资深中国古典诗词讲师，拥有20年教学经验。你的讲解深入浅出，既有学术深度又能让普通读者理解。
你的语言优美典雅，富有感染力。请用中文作答，每个章节控制在300-500字。`;

    for (const config of chapterConfigs) {
      // Enhance prompt with RAG context
      const relevantKnowledge = await this.ragService.search(
        `${poem.title} ${poem.author} ${config.title}`,
        2,
      );

      const knowledgeContext = relevantKnowledge
        .map((k) => k.content.slice(0, 300))
        .join('\n');

      const enhancedPrompt = `${config.prompt}\n\n【参考资料】：\n${knowledgeContext}`;

      const content = await this.aiService.generateText(systemPrompt, enhancedPrompt, {
        temperature: 0.8,
        maxTokens: 1000,
      });

      chapters.push({
        title: config.title,
        content,
        order: config.order,
      });
    }

    return {
      poemId: poem.id,
      poemTitle: poem.title,
      chapters: chapters.sort((a, b) => a.order - b.order),
    };
  }

  /**
   * 流式生成讲解
   */
  async *generateLectureStream(
    poem: { title: string; author: string; content: string },
    chapterIndex: number = 0,
  ): AsyncGenerator<string> {
    const chapterPrompts = [
      `请讲解《${poem.title}》的创作背景，诗人${poem.author}的创作动机和历史环境。`,
      `请逐句解析《${poem.title}》的每一句。诗词全文：${poem.content}`,
      `请分析《${poem.title}》的格律特点和艺术手法。`,
    ];

    const prompt = chapterPrompts[chapterIndex] || chapterPrompts[0];
    const systemPrompt = '你是一位资深中国古典诗词讲师，请用优美的中文进行讲解。';

    yield* this.aiService.generateTextStream(systemPrompt, prompt);
  }
}
