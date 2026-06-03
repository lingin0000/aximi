import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Poem } from '../../poems/entities/poem.entity';

@Entity('memorized')
export class Memorized {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'poem_id' })
  poemId: number;

  @Column({ type: 'float', default: 0 })
  progress: number;

  @CreateDateColumn({ name: 'memorized_at' })
  memorizedAt: Date;

  @ManyToOne(() => User, (user) => user.memorized, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Poem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poem_id' })
  poem: Poem;
}
