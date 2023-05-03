import { IsEmail, IsNotEmpty } from 'class-validator'

export class signInDataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
