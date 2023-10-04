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

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expiredAt: Date;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn()
  user: Relation<User>;

  @Column({ nullable: true })
  userId: number;
}
