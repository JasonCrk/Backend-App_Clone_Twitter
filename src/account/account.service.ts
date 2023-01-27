import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  Repository,
} from 'typeorm'

import { Account } from './entities/account.entity'

@Injectable()
export class AccountService {
  private readonly selectAccountItem: FindOptionsSelect<Account> = {
    id: true,
    avatar: true,
    verify: true,
    user: {
      username: true,
      firstName: true,
    },
  }

  private readonly relationsAccountItem: FindOptionsRelations<Account> = {
    user: true,
  }

  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async createAccount(): Promise<Account> {
    return await this.accountRepository.save({})
  }

  async findAccountsWhere(
    options: FindManyOptions<Account>
  ): Promise<Account[]> {
    return await this.accountRepository.find(options)
  }

  async getAccountByUsername(username: string): Promise<{ profile: Account }> {
    const profile = await this.accountRepository.findOne({
      where: {
        user: {
          username,
        },
      },
      select: {
        id: true,
        user: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          followers: {
            id: true,
          },
          posts: {
            id: true,
          },
        },
        followings: {
          id: true,
        },
        verify: true,
        avatar: true,
        header: true,
        birthday: true,
        bibliography: true,
        website: true,
        location: true,
        createdAt: true,
      },
      relations: {
        user: {
          followers: true,
          posts: true,
        },
        followings: true,
      },
    })

    if (!profile)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No existe el usuario',
        },
        HttpStatus.NOT_FOUND
      )

    return {
      profile,
    }
  }

  async userFollowers(
    userId: string,
    limit: number | undefined
  ): Promise<{ accounts: Account[] }> {
    let findAccountsOptions: FindManyOptions<Account> = {
      where: {
        followings: {
          id: userId,
        },
      },
      select: this.selectAccountItem,
      relations: this.relationsAccountItem,
    }

    if (limit) {
      findAccountsOptions = { ...findAccountsOptions, take: limit }
    }

    const accounts = await this.accountRepository.find(findAccountsOptions)

    return {
      accounts,
    }
  }

  async mostFollowedUsers(limit: number): Promise<{ accounts: Account[] }> {
    const accounts = await this.accountRepository.find({
      select: {
        id: true,
        avatar: true,
        verify: true,
        user: {
          followers: {
            id: true,
          },
          username: true,
          firstName: true,
        },
      },
      relations: {
        user: {
          followers: true,
        },
      },
    })

    const orderAccounts = accounts.sort((account1, account2) =>
      account1.user.followers.length < account2.user.followers.length
        ? 1
        : account1.user.followers.length > account2.user.followers.length
        ? -1
        : 0
    )

    return {
      accounts: orderAccounts.slice(0, limit),
    }
  }
}
