import { IsNotEmpty, Length, IsUUID } from 'class-validator'

export class createCommentDto {
  @IsNotEmpty()
  @Length(3, 200)
  content: string

  @IsNotEmpty()
  @IsUUID()
  postId: string
}
