import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './users.entity'

import { createUserDto } from './dto/users.dto'

import { hashPassword } from '../auth/helpers'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findOneById(userId: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: userId })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email })
  }

  async createUser(newUser: createUserDto): Promise<User | null> {
    const { password, ...user } = newUser
    const passwordEncrypted = await hashPassword(password)
    return await this.userRepository.save({
      ...user,
      password: passwordEncrypted,
    })
  }
}
