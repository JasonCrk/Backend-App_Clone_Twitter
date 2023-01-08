import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from 'src/users/users.entity'
import { ImagePost } from './imagePost.entity'
import { VideoPost } from './videoPost.entity'

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @ManyToOne(() => User, user => user.posts)
  user: User

  @ManyToOne(() => Post, post => post.postMentions)
  mention: Post

  @OneToMany(() => Post, post => post.mention)
  postMentions: Post[]

  @OneToMany(() => ImagePost, image => image.post)
  images: ImagePost[]

  @OneToMany(() => VideoPost, video => video.post)
  videos: VideoPost[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
