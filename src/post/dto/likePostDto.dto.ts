import { IsNotEmpty } from 'class-validator'

export class likePostDto {
  @IsNotEmpty()
  postId: string
}
