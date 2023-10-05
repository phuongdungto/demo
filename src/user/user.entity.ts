import { Post } from '../post/post.entity';
import { Role } from '../core/enum';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { Token } from '../auth/token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  fullname: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
    default: Role.USER,
    nullable: false,
  })
  role: string;

  @Column({ name: 'image', default: 'default-avatar.jpg' })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Relation<Post>[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Relation<Post>[];

  postsCount: number;
}
