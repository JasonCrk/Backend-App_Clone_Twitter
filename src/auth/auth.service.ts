import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { User } from 'src/users/users.entity'
import { UsersService } from 'src/users/users.service'
import { createUserDto } from 'src/users/dto/users.dto'
import { UserEntity } from 'src/users/interface/User'

import { AccountService } from 'src/account/account.service'

import { comparePasswords } from 'src/auth/helpers'
import { signInDataDto } from './dto/signInDataDto.dto'

import { SignIn } from './interfaces/signIn'
import { Payload } from './interfaces/Payload'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private accountService: AccountService,
    private jwtService: JwtService
  ) {}

  async validateUser({
    email,
    password,
  }: SignIn): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersService.findOneByEmail(email)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No se encontro ninguna cuenta registrada',
        },
        HttpStatus.NOT_FOUND
      )

    const matchPassword = await comparePasswords(password, user.password)
    if (!matchPassword)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'La contraseña no es correcta',
        },
        HttpStatus.FORBIDDEN
      )

    const { id, username, firstName, lastName } = user
    return {
      id,
      username,
      email,
      firstName,
      lastName,
    }
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload: Payload = { username: user.username, userId: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  async signIn(
    loginCredentials: signInDataDto
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByEmail(loginCredentials.email)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'El correo electrónico no coincide con ninguna cuenta',
        },
        HttpStatus.NOT_FOUND
      )

    const matchPassword = await comparePasswords(
      loginCredentials.password,
      user.password
    )
    if (!matchPassword)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'La contraseña es incorrecta',
        },
        HttpStatus.NOT_FOUND
      )

    const accessToken = this.jwtService.sign({
      username: user.username,
      userId: user.id,
    })

    return {
      accessToken,
    }
  }

  async registerUser(
    newUser: createUserDto
  ): Promise<{ user: Omit<UserEntity, 'password'> }> {
    const user = await this.usersService.createUser(newUser)
    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Hubo un error en el servidor, no se puedo crear el usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )

    const account = await this.accountService.createAccount({ user })

    if (!account)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Hubo un error en el servidor, no se puedo crear la cuenta',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )

    const { id, username, firstName, lastName, email } = user
    return {
      user: {
        id,
        username,
        firstName,
        lastName,
        email,
      },
    }
  }
}
