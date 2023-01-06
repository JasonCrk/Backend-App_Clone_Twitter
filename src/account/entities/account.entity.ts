import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'

import { User } from 'src/users/users.entity'

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User)
  @JoinColumn()
  user: User

  @Column()
  avatar: string

  @Column()
  header: string

  @Column()
  website: string

  @Column()
  bibliography: string

  @Column()
  location: string

  @Column()
  verify: boolean

  @Column()
  birthday: Date

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date
}
