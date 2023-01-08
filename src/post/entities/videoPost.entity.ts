import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Post } from './post.entity'

@Entity()
export class VideoPost {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  videoUrl: string

  @ManyToOne(() => Post, post => post.videos)
  post: Post
}
