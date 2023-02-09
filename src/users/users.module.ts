import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users.entity'

import { UsersService } from './users.service'

import { AccountModule } from 'src/account/account.module'
import { UsersController } from './users.controller'
import { MulterModule } from '@nestjs/platform-express/multer'
import { diskStorage } from 'multer'

@Module({
  imports: [
    AccountModule,
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      dest: './upload',
      storage: diskStorage({
        filename(_req, file, callback) {
          callback(null, Date.now() + '.' + file.originalname.split('.')[1])
        },
        destination(_req, _file, callback) {
          callback(null, './upload')
        },
      }),
    }),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
