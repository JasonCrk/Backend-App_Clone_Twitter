import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from 'src/users/users.service'
import { createUserDto } from 'src/users/dto/users.dto'
import { UserEntity } from 'src/users/interface/User'

import { comparePasswords } from 'src/auth/helpers'
import { signInDataDto } from './dto/signInDataDto.dto'

import { Payload } from './interfaces/Payload'
import { User } from 'src/users/users.entity'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Omit<UserEntity, 'password'>> {
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

  async login(
    user: Omit<UserEntity, 'password'>
  ): Promise<{ accessToken: string }> {
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

  async getUserById(userId: string): Promise<{ user: User }> {
    const user = await this.usersService.findOne(userId, {
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        account: {
          avatar: true,
        },
      },
      relations: {
        account: true,
      },
    })

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: '',
        },
        HttpStatus.NOT_FOUND
      )

    return { user }
  }
}
