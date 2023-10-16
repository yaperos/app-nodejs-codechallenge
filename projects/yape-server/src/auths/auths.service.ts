import { Injectable } from '@nestjs/common';
import { AuthInput } from './inputs/auth.input';
import { AuthType } from './dto/auth-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthsService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(input: AuthInput): Promise<any> {
    const { username, password } = input;
    const isUser = await this._usersService.findOneByUsername(username);

    if (!isUser) {
      return null;
    }

    const verifyPassword = await bcrypt.compare(
      password,
      isUser.password ?? '',
    );

    if (verifyPassword) {
      delete isUser.password;
      return isUser;
    } else {
      return null;
    }
  }

  async login(userDto: any): Promise<AuthType> {
    const authType = new AuthType();
    const payload = {
      sub: userDto.id,
      username: userDto.username,
      email: userDto.email,
    };

    authType.access_token = await this.jwtService.sign(payload);
    return authType;
  }
}
