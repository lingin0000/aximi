import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';

interface TtsOptions {
  voice?: string;
  speed?: number;
  style?: 'normal' | 'ancient' | 'emotional';
}

/**
 * AI 朗读服务 (TTS)
 *
 * 简化实现：使用 OpenAI TTS API
 * 生产环境可接入 Azure TTS / 火山引擎 TTS / ElevenLabs
 */
@Injectable()
export class TtsService {
  private readonly voices = [
    { id: 'alloy', name: 'Alloy (中性)', description: '自然流畅的中性嗓音', style: 'normal' },
    { id: 'echo', name: 'Echo (男声)', description: '深沉稳重的男声，适合豪放派诗词', style: 'ancient' },
    { id: 'shimmer', name: 'Shimmer (女声)', description: '温柔清澈的女声，适合婉约派诗词', style: 'emotional' },
    { id: 'onyx', name: 'Onyx (男声)', description: '坚定有力的男声', style: 'normal' },
    { id: 'nova', name: 'Nova (女声)', description: '轻柔灵动的女声，适合田园诗', style: 'emotional' },
  ];

  constructor(private aiService: AiService) {}

  getVoices() {
    return this.voices;
  }

  /**
   * 生成朗读音频 Buffer
   * 使用 OpenAI TTS API
   */
  async generateSpeech(
    text: string,
    options: TtsOptions = {},
  ): Promise<Buffer> {
    const voice = options.voice || 'shimmer';
    const speed = options.speed || 1.0;

    // Adjust text with style context
    let styledText = text;
    if (options.style === 'ancient') {
      styledText = `请用古风吟诵的方式朗读以下诗词：\n${text}`;
    }

    try {
      const client = this.aiService['client'];
      const response = await client.audio.speech.create({
        model: 'tts-1',
        voice: voice as any,
        input: styledText.slice(0, 4096), // TTS has input limit
        speed,
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    } catch (error) {
      console.error('TTS generateSpeech error:', error);
      throw error;
    }
  }

  /**
   * 获取诗词的情感音色推荐
   */
  recommendVoice(tags: string[]): string {
    if (tags.includes('豪放') || tags.includes('边塞')) return 'echo';
    if (tags.includes('婉约') || tags.includes('爱情')) return 'shimmer';
    if (tags.includes('田园') || tags.includes('山水')) return 'nova';
    if (tags.includes('怀古') || tags.includes('哲理')) return 'onyx';
    return 'alloy';
  }
}
