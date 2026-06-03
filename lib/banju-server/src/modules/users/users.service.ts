import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Favorite } from './entities/favorite.entity';
import { Memorized } from './entities/memorized.entity';
import { Collection } from './entities/collection.entity';
import { CollectionPoem } from './entities/collection-poem.entity';
import { Poem } from '../poems/entities/poem.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Favorite) private favRepo: Repository<Favorite>,
    @InjectRepository(Memorized) private memRepo: Repository<Memorized>,
    @InjectRepository(Collection) private colRepo: Repository<Collection>,
    @InjectRepository(CollectionPoem) private cpRepo: Repository<CollectionPoem>,
    @InjectRepository(Poem) private poemRepo: Repository<Poem>,
  ) {}

  // Favorites
  async toggleFavorite(userId: string, poemId: number) {
    const existing = await this.favRepo.findOne({ where: { userId, poemId } });
    if (existing) {
      await this.favRepo.remove(existing);
      return { favorited: false };
    }
    await this.favRepo.save({ userId, poemId });
    return { favorited: true };
  }

  async getFavorites(userId: string) {
    const favs = await this.favRepo.find({
      where: { userId },
      relations: ['poem'],
      order: { createdAt: 'DESC' },
    });
    return favs.map((f) => f.poem);
  }

  // Memorized
  async toggleMemorized(userId: string, poemId: number) {
    const existing = await this.memRepo.findOne({ where: { userId, poemId } });
    if (existing) {
      await this.memRepo.remove(existing);
      return { memorized: false };
    }
    await this.memRepo.save({ userId, poemId, progress: 0 });
    return { memorized: true };
  }

  async getMemorized(userId: string) {
    return this.memRepo.find({
      where: { userId },
      relations: ['poem'],
      order: { memorizedAt: 'DESC' },
    });
  }

  // Collections
  async createCollection(userId: string, name: string) {
    const col = this.colRepo.create({ userId, name });
    return this.colRepo.save(col);
  }

  async deleteCollection(userId: string, collectionId: string) {
    const col = await this.colRepo.findOne({
      where: { id: collectionId, userId },
    });
    if (!col) throw new NotFoundException('诗单不存在');
    await this.colRepo.remove(col);
    return { deleted: true };
  }

  async getCollections(userId: string) {
    return this.colRepo.find({
      where: { userId },
      relations: ['poems', 'poems.poem'],
      order: { createdAt: 'DESC' },
    });
  }

  async addToCollection(userId: string, collectionId: string, poemId: number) {
    const col = await this.colRepo.findOne({
      where: { id: collectionId, userId },
    });
    if (!col) throw new NotFoundException('诗单不存在');

    const existing = await this.cpRepo.findOne({
      where: { collectionId, poemId },
    });
    if (!existing) {
      await this.cpRepo.save({ collectionId, poemId });
    }
    return { added: true };
  }

  async removeFromCollection(
    userId: string,
    collectionId: string,
    poemId: number,
  ) {
    const col = await this.colRepo.findOne({
      where: { id: collectionId, userId },
    });
    if (!col) throw new NotFoundException('诗单不存在');

    await this.cpRepo.delete({ collectionId, poemId });
    return { removed: true };
  }
}
