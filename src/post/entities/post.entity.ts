import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { User } from 'src/users/users.entity'
import { ImagePost } from './imagePost.entity'
import { Comment } from 'src/comment/entities/comment.entity'

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @ManyToOne(() => User, user => user.posts)
  user: User

  @Column({
    nullable: true,
  })
  hashtags: string

  @ManyToOne(() => Post, post => post.postMentions, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  mention: Post

  @OneToMany(() => Post, post => post.mention)
  postMentions: Post[]

  @OneToMany(() => ImagePost, image => image.post)
  images: ImagePost[]

  @ManyToMany(() => User, user => user.postsLiked, {
    cascade: true,
  })
  @JoinTable()
  likes: User[]

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
