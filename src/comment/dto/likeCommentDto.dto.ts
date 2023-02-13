import { IsNotEmpty, IsUUID } from 'class-validator'

export class likeCommentDto {
  @IsNotEmpty()
  @IsUUID()
  commentId: string
}
