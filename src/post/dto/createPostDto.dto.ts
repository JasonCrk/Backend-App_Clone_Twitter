import { IsNotEmpty, IsOptional } from 'class-validator'

export class createPostDto {
  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  userId: string

  @IsOptional()
  mentionPostId: string
}
