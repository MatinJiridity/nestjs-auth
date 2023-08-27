import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/service/users.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { ATStrategy, RTStrategy } from 'src/strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[UsersModule, TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UsersService, ATStrategy, RTStrategy]
})
export class AuthModule {}
