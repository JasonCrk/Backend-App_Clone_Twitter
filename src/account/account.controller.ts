import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Query,
  Request,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'

import { Account } from './entities/account.entity'

import { JwtAuthGuard } from 'src/auth/jwt-auth.strategy'

import { Payload } from 'src/auth/interfaces/Payload'
import { AccountService } from './account.service'

import { followAccountDto } from './dto/followAccountDto.dto'

@Controller('api/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('search')
  async searchAccounts(
    @Query('query') query: string,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number
  ): Promise<{ accounts: Account[] }> {
    return await this.accountService.searchAccountsByUsernameOrFirstName(
      query,
      limit
    )
  }

  @Get('most_followed')
  async getMostFollowedUsers(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number
  ): Promise<{ accounts: Account[] }> {
    return await this.accountService.mostFollowedUsers(limit)
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow')
  async followAccount(
    @Request() req: { user: Payload },
    @Body() { userFollowId }: followAccountDto
  ): Promise<{ account: Account }> {
    return await this.accountService.followAccount(
      req.user.userId,
      userFollowId
    )
  }

  @Get(':username')
  async getProfile(
    @Param('username') username: string
  ): Promise<{ profile: Account }> {
    return await this.accountService.getAccountByUsername(username)
  }

  @Get(':username/followers')
  async getUserFollowers(
    @Param('username') username: string
  ): Promise<{ accounts: Account[] }> {
    return await this.accountService.userFollowers(username)
  }

  @Get(':username/followings')
  async getUserFollowings(
    @Param('username') username: string
  ): Promise<{ accounts: Account[] }> {
    return await this.accountService.userFollowings(username)
  }
}
