import { Module } from '@nestjs/common'

import { MulterModule } from '@nestjs/platform-express/multer'
import { diskStorage } from 'multer'

import { UsersModule } from '../users/users.module'
import { AccountModule } from 'src/account/account.module'

import { PostService } from './post.service'

import { PostController } from './post.controller'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { ImagePost } from './entities/imagePost.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, ImagePost]),
    UsersModule,
    AccountModule,
    MulterModule.register({
      dest: './upload',
      storage: diskStorage({
        filename(_req, file, callback) {
          callback(null, Date.now() + '.' + file.originalname.split('.')[1])
        },
        destination(_req, _file, callback) {
          callback(null, './upload')
        },
      }),
    }),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
