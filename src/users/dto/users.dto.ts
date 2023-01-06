import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'

import { PASSWORD_RULE } from 'src/auth/auth.utils'

export class createUserDto {
  @IsNotEmpty()
  @Length(3, 15)
  username: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(PASSWORD_RULE)
  password: string

  @IsNotEmpty()
  @Length(3, 40)
  firstName: string

  @IsNotEmpty()
  @Length(3, 40)
  lastName: string
}
