import { IsNotEmpty, IsOptional } from 'class-validator'

export class createPostDto {
  @IsNotEmpty()
  content: string

  @IsOptional()
  mentionPost: string
}
