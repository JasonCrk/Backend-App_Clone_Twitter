import { IsNotEmpty, Length, IsUUID, ValidateIf } from 'class-validator'

export class createCommentDto {
  @IsNotEmpty()
  @Length(3, 200)
  content: string

  @ValidateIf(o => !o.commentId)
  @IsNotEmpty()
  @IsUUID()
  postId: string

  @ValidateIf(o => !o.postId)
  @IsNotEmpty()
  @IsUUID()
  commentId: string
}
