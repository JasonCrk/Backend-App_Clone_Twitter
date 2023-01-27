import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

import { Comment } from './comment.entity'

@Entity({ name: 'image_comment' })
export class ImageComment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  imageUrl: string

  @ManyToOne(() => Comment, comment => comment.images, {
    onDelete: 'CASCADE',
  })
  comment: Comment
}
