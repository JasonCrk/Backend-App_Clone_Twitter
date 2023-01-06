import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity({ name: 'users' })
export class User extends BaseEntity {
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
}
