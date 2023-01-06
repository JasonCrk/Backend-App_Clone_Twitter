import {
  Controller,
  //  UseGuards,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

// import { JwtAuthGuard } from 'src/auth/jwt-auth.strategy'

import { AccountService } from './account.service'

import { Account } from './entities/account.entity'

@Controller('api/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get(':accountId')
  async getProfile(
    @Param('accountId') accountId: string
  ): Promise<{ profile: Account }> {
    const account = await this.accountService.findAccountById(accountId)
    if (!account)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'La cuenta no existe',
        },
        HttpStatus.NOT_FOUND
      )

    return {
      profile: account,
    }
  }
}
