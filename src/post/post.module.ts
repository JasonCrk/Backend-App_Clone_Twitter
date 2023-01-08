import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'

import { PostService } from './post.service'

import { PostController } from './post.controller'
import { ImagePost } from './entities/imagePost.entity'
import { VideoPost } from './entities/videoPost.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post, ImagePost, VideoPost])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
