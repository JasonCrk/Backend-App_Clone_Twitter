import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Account } from './entities/account.entity'

import { createAccountDto } from './dto/createAccountDto.dto'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async createAccount(accountData: createAccountDto): Promise<Account | null> {
    return await this.accountRepository.save(accountData)
  }

  async findAccountById(accountId: string): Promise<Account | null> {
    return await this.accountRepository.findOneBy({ id: accountId })
  }
}
