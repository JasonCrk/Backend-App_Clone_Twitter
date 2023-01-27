import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'

import { User } from './users.entity'

import { AccountService } from 'src/account/account.service'

import { createUserDto } from './dto/users.dto'

import { hashPassword } from '../auth/helpers'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private accountService: AccountService
  ) {}

  async findOneById(userId: string): Promise<User> {
    return await this.userRepository.findOneBy({
      id: userId,
    })
  }

  async findOne(
    userId: string,
    options: FindOneOptions<User>
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      ...options,
    })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email })
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({
      username,
    })
  }

  async createUser(userData: createUserDto): Promise<User | null> {
    const { password, ...user } = userData
    const passwordEncrypted = await hashPassword(password)

    const account = await this.accountService.createAccount()

    return await this.userRepository.save({
      ...user,
      account,
      password: passwordEncrypted,
    })
  }
}
