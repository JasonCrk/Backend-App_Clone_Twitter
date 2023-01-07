import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

import { Post } from 'src/post/entities/post.entity'

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

  @OneToMany(() => Post, post => post.user)
  posts: Post[]
}
