import { Express } from 'express'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Comment } from './entities/comment.entity'
import { ImageComment } from './entities/imageComment.entity'

import { UsersService } from 'src/users/users.service'
import { PostService } from 'src/post/post.service'

import cloudinary from 'src/utils/cloudinary'

import { createCommentDto } from './dto/createComment.dto'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(ImageComment)
    private imageCommentRepository: Repository<ImageComment>,
    private postService: PostService,
    private usersService: UsersService
  ) {}

  async findCommentsByPostId(postId: string): Promise<{ comments: Comment[] }> {
    const post = await this.postService.findOneById(postId)
    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: '',
        },
        HttpStatus.NOT_FOUND
      )

    const comments = await this.commentRepository.find({
      where: {
        post: {
          id: post.id,
        },
      },
      select: {
        id: true,
        content: true,
        images: {
          id: true,
          imageUrl: true,
        },
        likes: {
          id: true,
        },
        comments: {
          id: true,
        },
        post: {
          user: {
            username: true,
          },
        },
        user: {
          id: true,
          firstName: true,
          username: true,
          account: {
            id: true,
            avatar: true,
            verify: true,
          },
        },
        createdAt: true,
      },
      relations: {
        images: true,
        likes: true,
        comments: true,
        post: {
          user: true,
        },
        user: {
          account: true,
        },
      },
    })

    return {
      comments,
    }
  }

  async createComment(
    commentData: createCommentDto,
    userId: string,
    images: Array<Express.Multer.File>
  ): Promise<{ comment: Comment }> {
    const user = await this.usersService.findOneById(userId)

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'El usuario no existe',
        },
        HttpStatus.NOT_FOUND
      )

    const post = await this.postService.findOneById(commentData.postId)
    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'El tweet no existe',
        },
        HttpStatus.NOT_FOUND
      )

    const newComment = new Comment()

    newComment.post = post
    newComment.user = user
    newComment.content = commentData.content

    images.forEach(image => {
      cloudinary.uploader
        .upload(image.path, {
          folder: 'API_TWITTER/images',
        })
        .then(result => {
          const imageComment = new ImageComment()
          imageComment.imageUrl = result.url
          imageComment.comment = newComment

          this.imageCommentRepository.save(imageComment).then()
        })
    })

    const saveComment = await this.commentRepository.save(newComment)

    return {
      comment: saveComment,
    }
  }

  async deleteComment(commentId: string): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOneBy({ id: commentId })
    if (!comment)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'El comentario no existe',
        },
        HttpStatus.NOT_FOUND
      )

    await this.commentRepository.delete({ id: comment.id })

    return {
      message: 'Se ha eliminado correctamente el comentario',
    }
  }
}
