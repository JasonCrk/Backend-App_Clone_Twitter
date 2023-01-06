import { IsEmail, IsNotEmpty, Matches } from 'class-validator'

import { PASSWORD_RULE } from '../auth.utils'

export class signInDataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Matches(PASSWORD_RULE)
  password: string
}
