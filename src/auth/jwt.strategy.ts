import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import { JWTConstants } from './constants'

import { Payload } from './interfaces/Payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWTConstants.secret,
    })
  }

  async validate(payload: Payload): Promise<Payload> {
    return { userId: payload.userId, username: payload.username }
  }
}
