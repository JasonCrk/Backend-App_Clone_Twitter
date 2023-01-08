import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import { Post } from './post.entity'

@Entity({ name: 'gif_post' })
export class GifPost {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  gifUrl: string

  @ManyToOne(() => Post, post => post.gifs)
  post: Post
}
