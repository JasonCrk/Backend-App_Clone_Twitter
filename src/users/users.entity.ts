import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm'

import { Account } from 'src/account/entities/account.entity'
import { Post } from 'src/post/entities/post.entity'
import { Comment } from 'src/comment/entities/comment.entity'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @OneToOne(() => Account, account => account.user)
  @JoinColumn()
  account: Account

  @ManyToMany(() => Account, account => account.followings)
  followers: Account[]

  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @ManyToMany(() => Post, post => post.likes)
  postsLiked: Post[]

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[]

  @ManyToMany(() => Comment, comment => comment.likes)
  commentsLiked: Comment[]
}
