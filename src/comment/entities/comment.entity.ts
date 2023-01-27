import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm'

import { User } from 'src/users/users.entity'
import { Post } from 'src/post/entities/post.entity'
import { ImageComment } from './imageComment.entity'

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @ManyToOne(() => User, user => user.comments)
  user: User

  @ManyToOne(() => Post, post => post.comments)
  post: Post

  @ManyToMany(() => User, user => user.commentsLiked)
  @JoinTable()
  likes: User[]

  @OneToMany(() => ImageComment, image => image.comment)
  images: ImageComment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
