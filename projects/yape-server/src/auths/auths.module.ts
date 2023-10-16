import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthsResolver } from './auths.resolver';
import { AuthsService } from './auths.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

import * as fs from 'fs';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';

config();
const _configService = new ConfigService();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      privateKey: fs.readFileSync('src/auths/certs/jwt-private.key', 'utf8'),
      publicKey: fs.readFileSync('src/auths/certs/jwt-public.key', 'utf8'),
      signOptions: {
        algorithm: _configService.get('ALGORITHM'),
        expiresIn: _configService.get('ACCESS_TOKEN_EXPIRY'),
      },
    }),
  ],
  providers: [AuthsResolver, JwtStrategy, AuthsService, UsersService],
  exports: [AuthsService],
})
export class AuthsModule {}
