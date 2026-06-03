import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Poem } from '../../poems/entities/poem.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'poem_id' })
  poemId: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Poem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poem_id' })
  poem: Poem;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
