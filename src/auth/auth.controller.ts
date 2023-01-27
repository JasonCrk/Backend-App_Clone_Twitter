import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common'

import { createUserDto } from 'src/users/dto/users.dto'
import { UserEntity } from 'src/users/interface/User'
import { User } from 'src/users/users.entity'

import { AuthService } from './auth.service'
import { signInDataDto } from './dto/signInDataDto.dto'
import { Payload } from './interfaces/Payload'

import { JwtAuthGuard } from './jwt-auth.strategy'

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(
    @Body() signInData: signInDataDto
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInData)
  }

  @Post('signup')
  async signUp(
    @Body() newUser: createUserDto
  ): Promise<{ user: Omit<UserEntity, 'password'> }> {
    return await this.authService.registerUser(newUser)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: { user: Payload }): Promise<{ user: User }> {
    return await this.authService.getUserById(req.user.userId)
  }
}
