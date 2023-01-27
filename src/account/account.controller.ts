import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common'

import { AccountService } from './account.service'

import { Account } from './entities/account.entity'

@Controller('api/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('most_followed')
  async getMostFollowedUsers(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number
  ): Promise<{ accounts: Account[] }> {
    return await this.accountService.mostFollowedUsers(limit)
  }

  @Get(':username')
  async getProfile(
    @Param('username') username: string
  ): Promise<{ profile: Account }> {
    return await this.accountService.getAccountByUsername(username)
  }

  @Get(':userId/followers')
  async getUserFollowers(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<{ accounts: Account[] }> {
    return await this.accountService.userFollowers(userId, limit)
  }
}
