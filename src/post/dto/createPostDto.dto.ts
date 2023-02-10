import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class createPostDto {
  @IsNotEmpty()
  @MaxLength(255)
  content: string

  @IsOptional()
  hashtags: string

  @IsOptional()
  mentionPost: string
}
