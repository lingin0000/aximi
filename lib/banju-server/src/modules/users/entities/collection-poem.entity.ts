import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Collection } from './collection.entity';
import { Poem } from '../../poems/entities/poem.entity';

@Entity('collection_poems')
export class CollectionPoem {
  @PrimaryColumn({ name: 'collection_id', type: 'uuid' })
  collectionId: string;

  @PrimaryColumn({ name: 'poem_id' })
  poemId: number;

  @ManyToOne(() => Collection, (col) => col.poems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @ManyToOne(() => Poem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poem_id' })
  poem: Poem;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;
}
