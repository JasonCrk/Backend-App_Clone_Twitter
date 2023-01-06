import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './auth.service'

import { AuthController } from './auth.controller'

import { UsersModule } from 'src/users/users.module'

import { JWTConstants } from './constants'

import { JwtStrategy } from './local.strategy'
import { AccountModule } from 'src/account/account.module'

@Module({
  imports: [
    UsersModule,
    AccountModule,
    PassportModule,
    JwtModule.register({
      secret: JWTConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
