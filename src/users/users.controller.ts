import { Express } from 'express'

import {
  Controller,
  Patch,
  UseGuards,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

import { JwtAuthGuard } from 'src/auth/jwt-auth.strategy'

import { UsersService } from './users.service'

import { updateAccountDto } from './dto/updateAccountDto'

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':accountId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'header', maxCount: 1 },
    ])
  )
  async updateProfile(
    @Param('accountId', new ParseUUIDPipe()) accountId: string,
    @Body() updateAccountData: updateAccountDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[]
      header?: Express.Multer.File[]
    }
  ): Promise<{ message: string }> {
    return await this.usersService.updateProfile(
      accountId,
      updateAccountData,
      files
    )
  }
}
