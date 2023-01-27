import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users.entity'

import { UsersService } from './users.service'

import { AccountModule } from 'src/account/account.module'

@Module({
  imports: [AccountModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
