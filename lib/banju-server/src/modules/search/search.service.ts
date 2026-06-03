import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poem } from '../poems/entities/poem.entity';
import { getPinyinInitials, isPinyinInput, editDistance } from '../../utils/pinyin';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Poem)
    private poemRepository: Repository<Poem>,
  ) {}

  /**
   * Comprehensive search: exact match → pinyin → fuzzy → keyword
   */
  async search(query: string) {
    if (!query || !query.trim()) return [];

    const q = query.trim().toLowerCase();
    const isPinyin = isPinyinInput(q);
    const pinyinQuery = isPinyin ? q.replace(/\s/g, '') : '';
    const results: { poem: Poem; score: number; matchedLine?: string }[] = [];

    const poems = await this.poemRepository.find();

    for (const poem of poems) {
      const content = poem.content.replace(/\n/g, '');
      const fullText = content + poem.title + poem.author;

      // 1. Exact substring match in content
      if (content.includes(q)) {
        results.push({ poem, score: 100, matchedLine: q });
        continue;
      }

      // 2. Title match
      if (poem.title.includes(q)) {
        results.push({ poem, score: 95 });
        continue;
      }

      // 3. Author match
      if (poem.author.includes(q)) {
        results.push({ poem, score: 85 });
        continue;
      }

      // 4. Keyword split (Chinese input)
      if (!isPinyin && q.length >= 2) {
        const chars = q.split('');
        let matchCount = 0;
        for (const char of chars) {
          if (fullText.includes(char)) matchCount++;
        }
        if (matchCount >= Math.ceil(chars.length * 0.5)) {
          results.push({ poem, score: 60 + matchCount * 5 });
          continue;
        }
      }

      // 5. Pinyin initial match
      if (isPinyin) {
        const poemInitials = poem.pinyinInitials || '';
        if (poemInitials.includes(pinyinQuery)) {
          results.push({ poem, score: 80 });
          continue;
        }
      }

      // 6. Fuzzy match (edit distance) for short queries
      if (q.length >= 2 && q.length <= 7) {
        const lines = poem.content
          .split(/[，。？！；：\n]/)
          .filter((l) => l.trim().length >= 2);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.length >= q.length) {
            const dist = editDistance(q, trimmed.slice(0, q.length));
            if (dist <= 1) {
              results.push({ poem, score: 40, matchedLine: trimmed });
              break;
            }
          }
        }
      }
    }

    // Sort by score, deduplicate
    const seen = new Set<number>();
    return results
      .sort((a, b) => b.score - a.score)
      .filter((r) => {
        if (seen.has(r.poem.id)) return false;
        seen.add(r.poem.id);
        return true;
      });
  }
}
