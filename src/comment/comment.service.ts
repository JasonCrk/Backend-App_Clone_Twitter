import { Express } from 'express'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm'

import { Comment } from './entities/comment.entity'
import { ImageComment } from './entities/imageComment.entity'

import { UsersService } from 'src/users/users.service'
import { PostService } from 'src/post/post.service'

import cloudinary from 'src/utils/cloudinary'

import { createCommentDto } from './dto/createComment.dto'

@Injectable()
export class CommentService {
  private readonly commentSelectOptionsBase: FindOptionsSelect<Comment> = {
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
  }

  private readonly commentRelationsOptionsBase: FindOptionsRelations<Comment> =
    {
      images: true,
      likes: true,
      comments: true,
      user: {
        account: true,
      },
    }

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(ImageComment)
    private imageCommentRepository: Repository<ImageComment>,
    private postService: PostService,
    private usersService: UsersService
  ) {}

  async findCommentById(commentId: string): Promise<{ comment: Comment }> {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      select: {
        ...this.commentSelectOptionsBase,
        comment: {
          id: true,
          user: {
            username: true,
          },
        },
      },
      relations: {
        ...this.commentRelationsOptionsBase,
        comment: {
          user: true,
        },
      },
    })

    return {
      comment,
    }
  }

  async findCommentsByPostId(postId: string): Promise<{ comments: Comment[] }> {
    const post = await this.postService.findOneById(postId)
    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Tweet does not exist',
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
        ...this.commentSelectOptionsBase,
        post: {
          id: true,
          user: {
            username: true,
          },
        },
      },
      relations: {
        ...this.commentRelationsOptionsBase,
        post: {
          user: true,
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
