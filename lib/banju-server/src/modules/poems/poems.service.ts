import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Poem } from './entities/poem.entity';
import { PoemQueryDto } from './dto/poem-query.dto';
import { getPinyinInitials, isPinyinInput, editDistance } from '../../utils/pinyin';

@Injectable()
export class PoemsService {
  constructor(
    @InjectRepository(Poem)
    private poemRepository: Repository<Poem>,
  ) {}

  async findAll(query: PoemQueryDto) {
    const { dynasty, author, theme, form, page = 1, pageSize = 20 } = query;

    const qb = this.poemRepository.createQueryBuilder('poem');

    if (dynasty) qb.andWhere('poem.dynasty = :dynasty', { dynasty });
    if (author) qb.andWhere('poem.author = :author', { author });
    if (form) qb.andWhere('poem.form = :form', { form });
    if (theme) {
      qb.andWhere(':theme = ANY(poem.tags)', { theme });
    }

    qb.orderBy('poem.popularity', 'DESC')
      .addOrderBy('poem.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: number): Promise<Poem> {
    const poem = await this.poemRepository.findOne({ where: { id } });
    if (!poem) throw new NotFoundException('诗词不存在');
    return poem;
  }

  async getDaily(): Promise<Poem> {
    const count = await this.poemRepository.count();
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const index = dayOfYear % count;
    const poems = await this.poemRepository.find({ skip: index, take: 1 });
    return poems[0];
  }

  async getPopular(count: number = 8): Promise<Poem[]> {
    return this.poemRepository.find({
      order: { popularity: 'DESC' },
      take: count,
    });
  }

  async search(q: string, page = 1, pageSize = 20) {
    if (!q.trim()) return { items: [], total: 0, page, pageSize, totalPages: 0 };

    const query = q.trim().toLowerCase();
    const isPinyin = isPinyinInput(query);

    // Try exact content match first
    const exactMatches = await this.poemRepository
      .createQueryBuilder('poem')
      .where('poem.content LIKE :q', { q: `%${query}%` })
      .orWhere('poem.title LIKE :q', { q: `%${query}%` })
      .orWhere('poem.author LIKE :q', { q: `%${query}%` })
      .getMany();

    // Pinyin search
    let pinyinMatches: Poem[] = [];
    if (isPinyin) {
      const pinyinQuery = query.replace(/\s/g, '');
      pinyinMatches = await this.poemRepository
        .createQueryBuilder('poem')
        .where('poem.pinyin_initials LIKE :pq', { pq: `%${pinyinQuery}%` })
        .getMany();
    }

    // Combine and deduplicate
    const seen = new Set<number>();
    const combined: Poem[] = [];
    const addPoems = (poems: Poem[], score: number) => {
      for (const poem of poems) {
        if (!seen.has(poem.id)) {
          seen.add(poem.id);
          combined.push(poem);
        }
      }
    };

    addPoems(exactMatches, 100);
    addPoems(pinyinMatches, 80);

    // Apply pagination
    const total = combined.length;
    const start = (page - 1) * pageSize;
    const items = combined.slice(start, start + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getRelated(poemId: number, count: number = 4): Promise<Poem[]> {
    const poem = await this.findById(poemId);
    return this.poemRepository
      .createQueryBuilder('poem')
      .where('poem.id != :id', { id: poemId })
      .andWhere('(poem.author = :author OR poem.tags && :tags)', {
        author: poem.author,
        tags: poem.tags,
      })
      .orderBy('poem.popularity', 'DESC')
      .take(count)
      .getMany();
  }

  async getAuthors(): Promise<string[]> {
    const result = await this.poemRepository
      .createQueryBuilder('poem')
      .select('DISTINCT poem.author', 'author')
      .orderBy('author', 'ASC')
      .getRawMany();
    return result.map((r) => r.author);
  }

  async getDynasties(): Promise<string[]> {
    const result = await this.poemRepository
      .createQueryBuilder('poem')
      .select('DISTINCT poem.dynasty', 'dynasty')
      .orderBy('dynasty', 'ASC')
      .getRawMany();
    return result.map((r) => r.dynasty);
  }

  async getThemes(): Promise<string[]> {
    const poems = await this.poemRepository.find({ select: ['tags'] });
    const themes = new Set<string>();
    poems.forEach((p) => p.tags?.forEach((t) => themes.add(t)));
    return [...themes].sort();
  }

  async getForms(): Promise<string[]> {
    const result = await this.poemRepository
      .createQueryBuilder('poem')
      .select('DISTINCT poem.form', 'form')
      .where('poem.form IS NOT NULL')
      .orderBy('form', 'ASC')
      .getRawMany();
    return result.map((r) => r.form);
  }
}
