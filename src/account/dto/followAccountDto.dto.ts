import { IsNotEmpty, IsUUID } from 'class-validator'

export class followAccountDto {
  @IsNotEmpty()
  @IsUUID()
  userFollowId: string
}
