import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import configuration from './config/configuration'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AccountModule } from './account/account.module'
import { PostModule } from './post/post.module'
import { CommentModule } from './comment/comment.module'

import { User } from './users/users.entity'
import { Account } from './account/entities/account.entity'
import { Post } from './post/entities/post.entity'
import { ImagePost } from './post/entities/imagePost.entity'
import { Comment } from './comment/entities/comment.entity'
import { ImageComment } from './comment/entities/imageComment.entity'

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AccountModule,
    PostModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'jason:postgres',
      database: 'api_twitter',
      entities: [User, Account, Post, ImagePost, Comment, ImageComment],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
