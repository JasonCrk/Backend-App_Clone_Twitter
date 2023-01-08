import {
  Controller,
  Param,
  Get,
  Post,
  Request,
  HttpException,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.strategy'

import { Post as PostEntity } from './entities/post.entity'
import { PostService } from './post.service'

import { createPostDto } from './dto/createPostDto.dto'

@Controller('api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPosts(): Promise<{ posts: PostEntity[] }> {
    const posts = await this.postService.findAllPosts()
    return { posts }
  }

  @Get(':postId')
  async getPost(
    @Param('postId') postId: string
  ): Promise<{ post: PostEntity }> {
    const post = await this.postService.findPostById(postId)
    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: '',
        },
        HttpStatus.NOT_FOUND
      )

    return { post }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Body() { content, mentionPostId }: createPostDto,
    @Request() req: any
  ): Promise<{ post: PostEntity }> {
    const newPost = await this.postService.createPost({
      content,
      mentionPostId,
      userId: req.user.userId,
    })

    if (!newPost)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'No se ha creado el Tweet',
        },
        HttpStatus.BAD_REQUEST
      )

    return {
      post: newPost,
    }
  }
}
