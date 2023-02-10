import { Express } from 'express'

import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  Like,
  Repository,
} from 'typeorm'

import { Post } from './entities/post.entity'
import { ImagePost } from './entities/imagePost.entity'
import { Account } from 'src/account/entities/account.entity'

import { createPostDto } from './dto/createPostDto.dto'
import { searchQueriesList } from './dto/searchQueriesList.ls'

import { UsersService } from 'src/users/users.service'
import { AccountService } from 'src/account/account.service'

import cloudinary from 'src/utils/cloudinary'
import { updatePostDto } from './dto/updatePostDto.dto'

@Injectable()
export class PostService {
  private readonly selectPost: FindOptionsSelect<Post> = {
    mention: {
      id: true,
      content: true,
      hashtags: true,
      createdAt: true,
      updatedAt: true,
      likes: {
        id: true,
      },
      comments: {
        id: true,
      },
      user: {
        id: true,
        username: true,
        account: {
          id: true,
          avatar: true,
          verify: true,
        },
      },
    },
    user: {
      id: true,
      username: true,
      account: {
        id: true,
        avatar: true,
        verify: true,
      },
    },
    likes: {
      id: true,
    },
    comments: {
      id: true,
    },
  }

  private readonly relationsPost: FindOptionsRelations<Post> = {
    mention: {
      images: true,
      user: {
        account: true,
      },
      likes: true,
      comments: true,
    },
    images: true,
    user: {
      account: true,
    },
    likes: true,
    comments: true,
  }

  constructor(
    @InjectRepository(Post)
    private postRespository: Repository<Post>,
    @InjectRepository(ImagePost)
    private imagePostRepository: Repository<ImagePost>,
    private accountService: AccountService,
    private usersService: UsersService
  ) {}

  async findAllPosts(): Promise<{
    posts: Post[]
  }> {
    const posts = await this.postRespository.find({
      order: {
        createdAt: 'DESC',
      },
      select: this.selectPost,
      relations: this.relationsPost,
    })

    return { posts }
  }

  async findPostById(postId: string): Promise<{ post: Post }> {
    const post = await this.postRespository.findOne({
      where: {
        id: postId,
      },
      select: this.selectPost,
      relations: this.relationsPost,
    })

    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Tweet does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    return { post }
  }

  async findOneById(postId: string): Promise<Post> {
    return await this.postRespository.findOneBy({ id: postId })
  }

  async getUserPostsByUsername(username: string): Promise<{ posts: Post[] }> {
    const user = await this.usersService.findOneByUsername(username)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const posts = await this.postRespository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      select: this.selectPost,
      relations: this.relationsPost,
    })

    return {
      posts,
    }
  }

  async getLikedPostsByUsername(username: string): Promise<{ posts: Post[] }> {
    const user = await this.usersService.findOneByUsername(username)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const posts = await this.postRespository.find({
      where: {
        likes: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      select: this.selectPost,
      relations: this.relationsPost,
    })

    return {
      posts,
    }
  }

  async getMediaPostsByUsername(username: string): Promise<{ posts: Post[] }> {
    const user = await this.usersService.findOneByUsername(username)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const posts = await this.postRespository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'ASC',
      },
      select: this.selectPost,
      relations: this.relationsPost,
    })

    const postsWithImages: Post[] = []

    posts.forEach(post => {
      if (post.images.length > 0) postsWithImages.push(post)
    })

    return {
      posts: postsWithImages,
    }
  }

  async searchPosts(
    queries: searchQueriesList
  ): Promise<{ data: Post[] | Account[] }> {
    if (queries.find && queries.find === 'user') {
      const accounts = await this.accountService.findAccountsWhere({
        where: {
          user: {
            username: Like(`%${queries.query}%`),
          },
        },
        select: {
          id: true,
          avatar: true,
          verify: true,
          bibliography: true,
          user: {
            id: true,
            username: true,
          },
        },
        relations: {
          user: true,
        },
      })

      return {
        data: accounts,
      }
    }

    let findOptionsPosts: FindManyOptions<Post> = {
      where: [
        { content: Like(`%${queries.query}%`) },
        { hashtags: Like(`%${queries.query}%`) },
      ],
      select: this.selectPost,
      relations: this.relationsPost,
    }

    if (queries.find && queries.find === 'live') {
      findOptionsPosts = {
        ...findOptionsPosts,
        order: {
          createdAt: 'DESC',
        },
      }
    }

    const posts = await this.postRespository.find(findOptionsPosts)

    return {
      data: posts,
    }
  }

  async trendingsPosts(limit: number): Promise<{
    trends: { [hashtag: string]: number }
  }> {
    const findPostsOptions: FindManyOptions<Post> = {
      select: {
        hashtags: true,
      },
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    }

    const posts = await this.postRespository.find(findPostsOptions)

    const trendPosts: { [hashtag: string]: number } = {}

    posts.forEach(post => {
      if (post.hashtags) {
        const hashtags = post.hashtags.split(',')

        hashtags.forEach(hashtag => {
          const normalizeHashtag = hashtag.trim()
          const trendPostExist =
            Object.keys(trendPosts).includes(normalizeHashtag)

          if (trendPostExist) {
            trendPosts[normalizeHashtag]++
          } else {
            trendPosts[normalizeHashtag] = 1
          }
        })
      }
    })

    return {
      trends: trendPosts,
    }
  }

  async createPost(
    postData: createPostDto,
    userId: string,
    images: Array<Express.Multer.File>
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId)

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const newPost = new Post()

    newPost.content = postData.content
    newPost.user = user

    if (postData.hashtags) {
      newPost.hashtags = postData.hashtags
    }

    if (postData.mentionPost) {
      const mentionPost = await this.postRespository.findOneBy({
        id: postData.mentionPost,
      })

      if (!mentionPost)
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Tweet to mention does not exist',
          },
          HttpStatus.NOT_FOUND
        )

      newPost.mention = mentionPost
    }

    images.forEach(image => {
      cloudinary.uploader
        .upload(image.path, {
          folder: 'API_TWITTER/images',
        })
        .then(result => {
          const imagePost = new ImagePost()
          imagePost.imageUrl = result.url
          imagePost.post = newPost

          this.imagePostRepository.save(imagePost).then()
        })
    })

    await this.postRespository.save(newPost)

    return {
      message: 'Tweet has been published',
    }
  }

  async updatePost(
    userId: string,
    postId: string,
    postUpdateData: updatePostDto
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const post = await this.postRespository.findOne({
      where: {
        id: postId,
      },
      select: {
        id: true,
        user: {
          id: true,
        },
      },
      relations: {
        user: true,
      },
    })

    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Tweet does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    if (post.user.id !== user.id)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'You are not the owner of the tweet',
        },
        HttpStatus.UNAUTHORIZED
      )

    await this.postRespository.update({ id: post.id }, postUpdateData)

    return {
      message: 'Tweet has been updated',
    }
  }

  async deletePost(
    postId: string,
    userId: string
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId)

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const post = await this.postRespository.findOne({
      where: {
        id: postId,
      },
      select: {
        id: true,
        user: {
          id: true,
        },
      },
      relations: {
        user: true,
      },
    })

    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Tweet does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    if (post.user.id !== user.id)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'You are not the owner of the tweet',
        },
        HttpStatus.UNAUTHORIZED
      )

    await this.postRespository.delete({ id: post.id })

    return {
      message: 'Tweet has been deleted',
    }
  }

  async likePost(userId: string, postId: string): Promise<{ post: Post }> {
    const user = await this.usersService.findOneById(userId)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const post = await this.postRespository.findOne({
      where: {
        id: postId,
      },
      select: {
        likes: {
          id: true,
        },
        id: true,
      },
      relations: {
        likes: true,
      },
    })

    if (!post)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User does not exist',
        },
        HttpStatus.NOT_FOUND
      )

    const matchUserLikedPost = post.likes.find(
      userLike => userLike.id === user.id
    )

    if (!matchUserLikedPost) {
      post.likes.push(user)
    } else {
      post.likes = post.likes.filter(likeUser => likeUser.id !== user.id)
    }

    const savePost = await this.postRespository.save(post)

    return {
      post: savePost,
    }
  }
}
