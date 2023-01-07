import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { User } from 'src/users/users.entity'

@Entity()
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

  @Column()
  created_at: Date

  @Column()
  updated_at: Date
}
