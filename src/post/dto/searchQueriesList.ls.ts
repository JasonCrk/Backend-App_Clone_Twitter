import { IsNotEmpty, IsOptional } from 'class-validator'

export class searchQueriesList {
  @IsNotEmpty()
  query: string

  @IsOptional()
  find: string // undefined, live or user
}
