import { Express } from 'express'

import {
  Controller,
  Param,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
  DefaultValuePipe,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common'

import { FilesInterceptor } from '@nestjs/platform-express'

import { JwtAuthGuard } from 'src/auth/jwt-auth.strategy'
import { Payload } from 'src/auth/interfaces/Payload'

import { Post as PostEntity } from './entities/post.entity'
import { PostService } from './post.service'

import { Account } from 'src/account/entities/account.entity'

import { createPostDto } from './dto/createPostDto.dto'
import { likePostDto } from './dto/likePostDto.dto'
import { searchQueriesList } from './dto/searchQueriesList.ls'
import { updatePostDto } from './dto/updatePostDto.dto'

@Controller('api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPosts(): Promise<{ posts: PostEntity[] }> {
    return await this.postService.findAllPosts()
  }

  @Get('search')
  async searchPosts(
    @Query() queries: searchQueriesList
  ): Promise<{ data: PostEntity[] | Account[] }> {
    return await this.postService.searchPosts(queries)
  }

  @Get('trends')
  async trendsPosts(
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number
  ): Promise<{
    trends: { [hashtag: string]: number }
  }> {
    return await this.postService.trendingsPosts(limit)
  }

  @Get('user/:username')
  async getUserPosts(
    @Param('username') username: string
  ): Promise<{ posts: PostEntity[] }> {
    return await this.postService.getUserPostsByUsername(username)
  }

  @Get('user/:username/liked')
  async getLikedPosts(
    @Param('username') username: string
  ): Promise<{ posts: PostEntity[] }> {
    return await this.postService.getLikedPostsByUsername(username)
  }

  @Get('user/:username/media')
  async getMediaPosts(
    @Param('username') username: string
  ): Promise<{ posts: PostEntity[] }> {
    return await this.postService.getMediaPostsByUsername(username)
  }

  @Get(':postId')
  async getPost(
    @Param('postId', new ParseUUIDPipe()) postId: string
  ): Promise<{ post: PostEntity }> {
    return await this.postService.findPostById(postId)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  async createPost(
    @Body() postData: createPostDto,
    @Request() req: { user: Payload },
    @UploadedFiles() images: Array<Express.Multer.File>
  ): Promise<{ message: string }> {
    return await this.postService.createPost(postData, req.user.userId, images)
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  async likePost(
    @Request() req: { user: Payload },
    @Body() post: likePostDto
  ): Promise<{ post: PostEntity }> {
    return await this.postService.likePost(req.user.userId, post.postId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  async updatePost(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @Request() req: { user: Payload },
    @Body() postData: updatePostDto
  ): Promise<{ message: string }> {
    return await this.postService.updatePost(req.user.userId, postId, postData)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deletePost(
    @Request() req: { user: Payload },
    @Param('postId', new ParseUUIDPipe()) postId: string
  ): Promise<{ message: string }> {
    return await this.postService.deletePost(postId, req.user.userId)
  }
}
