import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AccountModule } from './account/account.module'
import { PostModule } from './post/post.module'

import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users/users.entity'
import { Account } from './account/entities/account.entity'
import { Post } from './post/entities/post.entity'
import { ImagePost } from './post/entities/imagePost.entity'
import { VideoPost } from './post/entities/videoPost.entity'
import { GifPost } from './post/entities/gifPost.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'jason:postgres',
      database: 'api_twitter',
      entities: [User, Account, Post, ImagePost, VideoPost, GifPost],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AccountModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
