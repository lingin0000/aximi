import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';

interface KnowledgeChunk {
  id: string;
  content: string;
  poemId?: number;
  chunkType: 'content' | 'appreciation' | 'background' | 'technique';
  embedding?: number[];
}

/**
 * RAG 诗词知识库服务
 *
 * 简化实现：内存存储诗词知识分块 + 向量检索
 * 生产环境建议使用 pgvector 或 Milvus
 */
@Injectable()
export class RagService {
  private chunks: KnowledgeChunk[] = [];
  private initialized = false;

  constructor(private aiService: AiService) {}

  /**
   * 初始化知识库：将诗词原文、赏析等分块并向量化
   */
  async initialize(poems: { id: number; content: string; translation?: string; appreciation?: string }[]) {
    this.chunks = [];

    for (const poem of poems) {
      // Chunk 1: 诗词原文
      this.chunks.push({
        id: `poem-${poem.id}-content`,
        content: poem.content,
        poemId: poem.id,
        chunkType: 'content',
      });

      // Chunk 2: 赏析
      if (poem.appreciation && poem.appreciation.length > 20) {
        this.chunks.push({
          id: `poem-${poem.id}-appreciation`,
          content: poem.appreciation,
          poemId: poem.id,
          chunkType: 'appreciation',
        });
      }
    }

    this.initialized = true;
    console.log(`[RAG] Knowledge base initialized with ${this.chunks.length} chunks`);
  }

  /**
   * 向量检索：找到与 query 最相似的知识块
   * 简化实现：关键词匹配 + 语义评分；生产环境用向量相似度
   */
  async search(query: string, topK: number = 5): Promise<KnowledgeChunk[]> {
    if (!this.initialized) return [];

    // 简化检索：计算查询词与每个 chunk 的重叠度
    const queryChars = new Set(query.split(''));
    const scored = this.chunks.map((chunk) => {
      const chunkChars = new Set(chunk.content.split(''));
      let overlap = 0;
      queryChars.forEach((c) => {
        if (chunkChars.has(c)) overlap++;
      });
      const score = overlap / queryChars.size;
      return { chunk, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => s.chunk);
  }

  /**
   * RAG 问答：检索相关知识 + LLM 生成回答
   */
  async ask(question: string, poemContext?: string): Promise<string> {
    const relevantChunks = await this.search(question, 5);

    const context = relevantChunks
      .map((c) => `[${c.chunkType === 'content' ? '诗词原文' : '赏析'}]: ${c.content.slice(0, 500)}`)
      .join('\n\n');

    const systemPrompt = `你是一位精通中国古典诗词的学者。请根据提供的诗词知识，用优雅的中文回答用户的问题。
如果提供的知识不足以回答，请基于你的诗词知识给出合理回答。回答要简洁、准确、有诗意。

【知识库内容】：
${context}

${poemContext ? `【当前讨论的诗词】：${poemContext}` : ''}`;

    return this.aiService.generateText(systemPrompt, question);
  }

  /**
   * 语义相似诗词推荐
   */
  async findSimilar(poemContent: string, allPoems: { id: number; title: string; author: string; content: string }[], topK: number = 5) {
    const queryChars = new Set(poemContent.split(''));

    const scored = allPoems.map((poem) => {
      const poemChars = new Set(poem.content.split(''));
      let overlap = 0;
      queryChars.forEach((c) => {
        if (poemChars.has(c)) overlap++;
      });
      return { poem, score: overlap / Math.max(queryChars.size, 1) };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => s.poem);
  }
}
