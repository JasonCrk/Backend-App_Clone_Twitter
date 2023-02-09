import { User } from 'src/users/users.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    default: 'https://pbs.twimg.com/media/FgqBU4yWYAAPZ6-.png',
  })
  avatar: string

  @Column({
    default:
      'https://images.wondershare.com/repairit/aticle/2021/08/twitter-header-photo-issues-1.jpg',
  })
  header: string

  @OneToOne(() => User, user => user.account)
  user: User

  @ManyToMany(() => User, user => user.followers)
  @JoinTable()
  followings: User[]

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
