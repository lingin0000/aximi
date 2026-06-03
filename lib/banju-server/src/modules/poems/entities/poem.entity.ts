import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('poems')
export class Poem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  @Index()
  title: string;

  @Column({ length: 100 })
  @Index()
  author: string;

  @Column({ length: 20 })
  @Index()
  dynasty: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  translation: string;

  @Column({ type: 'text', nullable: true })
  appreciation: string;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ length: 50, nullable: true })
  form: string;

  @Column({ name: 'pinyin_initials', length: 500, nullable: true })
  pinyinInitials: string;

  @Column({ default: 0 })
  popularity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
