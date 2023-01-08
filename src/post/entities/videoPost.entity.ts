import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Post } from './post.entity'

@Entity({ name: 'video_post' })
export class VideoPost {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  videoUrl: string

  @ManyToOne(() => Post, post => post.videos)
  post: Post
}
