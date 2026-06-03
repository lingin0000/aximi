import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Favorite } from './favorite.entity';
import { Memorized } from './memorized.entity';
import { Collection } from './collection.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites: Favorite[];

  @OneToMany(() => Memorized, (mem) => mem.user)
  memorized: Memorized[];

  @OneToMany(() => Collection, (col) => col.user)
  collections: Collection[];
}
