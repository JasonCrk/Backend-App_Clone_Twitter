import { Controller, Post, Body } from '@nestjs/common'

import { createUserDto } from 'src/users/dto/users.dto'
import { UserEntity } from 'src/users/interface/User'

import { AuthService } from './auth.service'
import { signInDataDto } from './dto/signInDataDto.dto'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() loginData: signInDataDto
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(loginData)
  }

  @Post('signup')
  async signUp(
    @Body() newUser: createUserDto
  ): Promise<{ user: Omit<UserEntity, 'password'> }> {
    return await this.authService.registerUser(newUser)
  }
}
