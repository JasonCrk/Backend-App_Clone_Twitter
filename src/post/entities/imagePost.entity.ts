import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import { Post } from './post.entity'

@Entity({ name: 'image_post' })
export class ImagePost {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  imageUrl: string

  @ManyToOne(() => Post, post => post.images, {
    onDelete: 'CASCADE',
  })
  post: Post
}
