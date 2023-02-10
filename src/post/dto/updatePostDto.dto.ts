import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class updatePostDto {
  @IsNotEmpty()
  @MaxLength(255)
  content: string

  @IsOptional()
  @MaxLength(100)
  hashtags: string
}
