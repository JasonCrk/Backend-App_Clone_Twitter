import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users/users.entity'

import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'jason:postgres',
      database: 'api_twitter',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
