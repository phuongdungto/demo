import {
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../auth/auth.guard';
import { createPostDto, getPostsDto, updatePostDto } from './post.dto';
import { NextFunction, Request, Response } from 'express';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Body() body: createPostDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId = req['user'].sub as number;
      const newPost = await this.postService.createPost(body, userId);
      res.status(201).send(newPost);
    } catch (error) {
      next(error);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updatePost(
    @Param('id') postId: number,
    @Body()
    body: updatePostDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId: number = req['user'].sub;
      const updatePost = await this.postService.updatePost(
        body,
        postId,
        userId,
      );
      return res.status(200).send(updatePost);
    } catch (error) {
      next(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(
    @Param('id') postId: number,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId: number = req['user'].sub;
      await this.postService.deletePost(postId, userId);
      return res.status(200).send({
        code: 'SUCESS',
        message: 'deleted post successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
  async getPost(
    @Param('id') postId: number,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const post = await this.postService.getPost(postId);
      return res.status(200).send(post);
    } catch (error) {
      next(error);
    }
  }

  @Get()
  async getPosts(
    @Query() input: getPostsDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.postService.getPosts(input);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
