import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { createPostDto, getPostsDto, updatePostDto } from './post.dto';
import { Pagination } from '../core/utils/pagination.ultis';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  async createPost(body: createPostDto, userId: number): Promise<Post> {
    const post = new Post();
    Object.assign(post, body);
    post.userId = userId;
    console.log(userId);
    console.log(post);
    const postNew = await this.postRepo.save(post);
    return postNew;
  }

  async updatePost(
    body: updatePostDto,
    postId: number,
    userId: number,
  ): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException();
    }
    Object.assign(post, body);
    console.log(post);
    const newPost = await this.postRepo.save(post);
    return newPost;
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException();
    }
    await this.postRepo.delete(postId);
  }

  async getPost(postId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  async getPosts(input: getPostsDto) {
    const query = Pagination(Post, input);
    const [rows, count] = await this.postRepo.findAndCount({
      ...query,
    });
    return { totalPage: Math.ceil(count / input.limit), posts: rows };
  }
}
