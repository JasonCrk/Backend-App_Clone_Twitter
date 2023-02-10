import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  ILike,
  Repository,
} from 'typeorm'

import { Account } from './entities/account.entity'

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

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

  async findAccountWhere(options: FindOneOptions<Account>): Promise<Account> {
    return await this.accountRepository.findOne(options)
  }

  async updateAccount(
    id: string,
    accountData: QueryDeepPartialEntity<Account>
  ): Promise<void> {
    await this.accountRepository.update({ id }, accountData)
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

  async searchAccountsByUsernameOrFirstName(
    query: string,
    limit: number
  ): Promise<{ accounts: Account[] }> {
    const searchAccounts = await this.accountRepository.find({
      where: [
        {
          user: {
            username: ILike(`${query}%`),
          },
        },
        {
          user: {
            firstName: ILike(`${query}%`),
          },
        },
      ],
      take: limit,
      select: {
        id: true,
        avatar: true,
        verify: true,
        user: {
          id: true,
          username: true,
          firstName: true,
          followers: {
            id: true,
          },
        },
      },
      relations: {
        user: {
          followers: true,
        },
      },
    })

    return {
      accounts: searchAccounts,
    }
  }

  async userFollowers(userId: string): Promise<{ accounts: Account[] }> {
    const findAccountsOptions: FindManyOptions<Account> = {
      where: {
        followings: {
          id: userId,
        },
      },
      select: this.selectAccountItem,
      relations: this.relationsAccountItem,
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
          id: true,
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

    const orderAccounts = accounts.sort((accountBefore, accountAfter) =>
      accountBefore.user.followers.length < accountAfter.user.followers.length
        ? 1
        : accountBefore.user.followers.length >
          accountAfter.user.followers.length
        ? -1
        : 0
    )

    return {
      accounts: orderAccounts.slice(0, limit),
    }
  }

  async followAccount(
    userId: string,
    userFollowId: string
  ): Promise<{ account: Account }> {
    const account = await this.accountRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        followings: {
          id: true,
        },
      },
      relations: {
        followings: true,
      },
    })

    if (!account)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'El usuario no existe',
        },
        HttpStatus.NOT_FOUND
      )

    const userAccount = await this.accountRepository.findOne({
      where: {
        user: {
          id: userFollowId,
        },
      },
      select: {
        user: {
          id: true,
        },
      },
      relations: {
        user: true,
      },
    })

    if (!userAccount.user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'El usuario no existe',
        },
        HttpStatus.NOT_FOUND
      )

    const matchUserFollowingAccount = account.followings.find(
      accountFollowed => accountFollowed.id === userAccount.user.id
    )

    if (!matchUserFollowingAccount) {
      account.followings.push(userAccount.user)
    } else {
      account.followings = account.followings.filter(
        accountFollow => accountFollow.id !== userAccount.user.id
      )
    }

    const saveAccount = await this.accountRepository.save(account)

    return {
      account: saveAccount,
    }
  }
}
