import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    });
  }

  get model(): string {
    return process.env.AI_MODEL || 'gpt-4o';
  }

  /**
   * 调用 LLM 生成文本（非流式）
   */
  async generateText(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI generateText error:', error);
      throw error;
    }
  }

  /**
   * 调用 LLM 生成文本（流式）
   */
  async *generateTextStream(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number },
  ): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) yield content;
      }
    } catch (error) {
      console.error('AI generateTextStream error:', error);
      throw error;
    }
  }

  /**
   * 生成 Embedding 向量
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 1536,
      });
      return response.data[0]?.embedding || [];
    } catch (error) {
      console.error('AI generateEmbedding error:', error);
      return [];
    }
  }
}
