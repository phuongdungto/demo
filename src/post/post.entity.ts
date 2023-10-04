import { User } from '../user/user.entity';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  Relation,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ length: 500 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: Relation<User>;

  @Column({ nullable: true })
  userId: number;
}
