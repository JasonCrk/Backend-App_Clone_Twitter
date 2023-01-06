import { IsNotEmpty } from 'class-validator'

import { User } from 'src/users/users.entity'

export class createAccountDto {
  @IsNotEmpty()
  user: User
}
