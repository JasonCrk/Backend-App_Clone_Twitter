import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from 'src/users/users.entity'

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User)
  @JoinColumn()
  user: User

  @Column({
    nullable: true,
    default: 'https://pbs.twimg.com/media/FgqBU4yWYAAPZ6-.png',
  })
  avatar: string

  @Column({
    nullable: true,
    default:
      'https://images.wondershare.com/repairit/aticle/2021/08/twitter-header-photo-issues-1.jpg',
  })
  header: string

  @Column({ nullable: true })
  website: string

  @Column({ nullable: true })
  bibliography: string

  @Column({ nullable: true })
  location: string

  @Column({ default: false })
  verify: boolean

  @Column({ nullable: true })
  birthday: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
