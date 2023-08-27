import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ATGuard } from './common/guards';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'matin123456789',
    database: 'jwt',
    entities: [User],
    synchronize: true,
  }), UsersModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ATGuard // GlobalGuards: every route has at guard except @Public()
    }
  ],
})
export class AppModule {}
