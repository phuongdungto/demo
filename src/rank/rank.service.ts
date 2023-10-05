import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post/post.entity';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getRankYearly() {
    const year = new Date();
    // const query = await this.userRepo
    //   .createQueryBuilder('u')
    //   //   .select(['u.*'])
    //   .innerJoin('u.posts', 'posts')
    //   .loadRelationCountAndMap(
    //     'u.postsCount',
    //     'u.posts',
    //     'posts',
    //     (queryBuilder) =>
    //       queryBuilder
    //         .where(`YEAR(posts.createdAt) = :year`, { year })
    //         .addOrderBy('u.postsCount', 'DESC'),
    //   )
    //   .getMany();
    // console.log(query);

    const query = await this.entityManager.query(
      `SELECT u.fullname, u.id, u.image, COUNT(p.id) as postCount FROM users u join posts p on u.id = p.user_id where YEAR(p.created_at)=? GROUP BY u.id ORDER BY postCount DESC LIMIT 100 `,
      [year.getFullYear()],
    );
    return query;
  }

  async getRankMonthly() {
    const month = new Date();
    const query = await this.entityManager.query(
      `SELECT u.fullname, u.id, u.image, COUNT(p.id) as postCount FROM users u join posts p on u.id = p.user_id where MONTH(p.created_at)=? AND YEAR(p.created_at)=? GROUP BY u.id ORDER BY postCount DESC LIMIT 100 `,
      [month.getMonth() + 1, month.getFullYear()],
    );
    return query;
  }
}
