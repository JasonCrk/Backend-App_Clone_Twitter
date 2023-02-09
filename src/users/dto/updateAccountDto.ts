import { IsNotEmpty, IsOptional, MaxLength, Length } from 'class-validator'

export class updateAccountDto {
  @IsOptional()
  @MaxLength(100)
  website: string

  @IsOptional()
  @MaxLength(160)
  bibliography: string

  @IsOptional()
  @MaxLength(30)
  location: string

  @IsNotEmpty()
  @Length(3, 50)
  firstName: string
}
