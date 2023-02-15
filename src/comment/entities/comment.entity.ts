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

  @OneToMany(() => ImageComment, image => image.comment)
  images: ImageComment[]

  @ManyToOne(() => User, user => user.comments)
  user: User

  @ManyToOne(() => Post, post => post.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post: Post

  @ManyToOne(() => Comment, comment => comment.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  comment: Comment

  @OneToMany(() => Comment, comment => comment.comment)
  comments: Comment[]

  @ManyToMany(() => User, user => user.commentsLiked, {
    cascade: true,
  })
  @JoinTable()
  likes: User[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
