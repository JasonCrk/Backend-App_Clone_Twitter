import { Express } from 'express'

import { Injectable, HttpException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'

import { User } from './users.entity'

import { AccountService } from 'src/account/account.service'

import { createUserDto } from './dto/users.dto'

import { hashPassword } from '../auth/helpers'
import { updateAccountDto } from './dto/updateAccountDto'
import { Account } from 'src/account/entities/account.entity'

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import cloudinary from 'src/utils/cloudinary'
import { HttpStatus } from '@nestjs/common/enums'

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

  async updateProfile(
    accountId: string,
    updateAccountData: updateAccountDto,
    images: {
      avatar?: Express.Multer.File[]
      header?: Express.Multer.File[]
    }
  ): Promise<{ message: string }> {
    const account = await this.accountService.findAccountWhere({
      where: {
        id: accountId,
      },
      select: {
        id: true,
        user: {
          id: true,
        },
      },
      relations: {
        user: true,
      },
    })

    if (!account)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'La cuenta no existe',
        },
        HttpStatus.NOT_FOUND
      )

    const { firstName, ...accountData } = updateAccountData

    let updateData: QueryDeepPartialEntity<Account> = {
      ...accountData,
    }

    if (images.avatar) {
      const avatarImg = await cloudinary.uploader.upload(
        images.avatar[0].path,
        {
          folder: 'API_TWITTER/avatars',
        }
      )

      updateData = {
        ...updateData,
        avatar: avatarImg.url,
      }
    }

    if (images.header) {
      const headerImg = await cloudinary.uploader.upload(
        images.header[0].path,
        {
          folder: 'API_TWITTER/headers',
        }
      )

      updateData = {
        ...updateData,
        header: headerImg.url,
      }
    }

    await this.accountService.updateAccount(accountId, updateData)
    await this.userRepository.update({ id: account.user.id }, { firstName })

    return {
      message: 'Actualizacion de cuenta completada',
    }
  }
}
