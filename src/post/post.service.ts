import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { Post } from './entities/post.entity'

import { createPostDto } from './dto/createPostDto.dto'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRespository: Repository<Post>
  ) {}

  async findPostById(postId: string): Promise<Post | null> {
    return await this.postRespository.findOneBy({ id: postId })
  }

  async createPost(postData: createPostDto): Promise<Post | null> {
    return await this.postRespository.save(postData)
  }

  async findAllPosts(): Promise<Post[]> {
    return await this.postRespository.find()
  }
}
