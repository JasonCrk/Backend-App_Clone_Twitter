import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostModule } from 'src/post/post.module'
import { UsersModule } from 'src/users/users.module'

import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

import { Comment } from './entities/comment.entity'
import { ImageComment } from './entities/imageComment.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, ImageComment]),
    PostModule,
    UsersModule,
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
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
