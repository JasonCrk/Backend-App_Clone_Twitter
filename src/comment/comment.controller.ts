import { Express } from 'express'

import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Body,
  Request,
  Param,
  UploadedFiles,
  Delete,
} from '@nestjs/common'

import { FilesInterceptor } from '@nestjs/platform-express'

import { Payload } from 'src/auth/interfaces/Payload'
import { Comment } from './entities/comment.entity'

import { CommentService } from './comment.service'

import { JwtAuthGuard } from 'src/auth/jwt-auth.strategy'

import { createCommentDto } from './dto/createComment.dto'

@Controller('api/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  async createComment(
    @Body() commentData: createCommentDto,
    @Request() req: { user: Payload },
    @UploadedFiles() images: Array<Express.Multer.File>
  ): Promise<{ comment: Comment }> {
    return await this.commentService.createComment(
      commentData,
      req.user.userId,
      images
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string
  ): Promise<{ message: string }> {
    return await this.commentService.deleteComment(commentId)
  }
}