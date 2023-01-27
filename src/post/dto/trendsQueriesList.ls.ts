import { IsInt, IsOptional } from 'class-validator'

export class trendsQueriesList {
  @IsOptional()
  @IsInt()
  limit: number
}
