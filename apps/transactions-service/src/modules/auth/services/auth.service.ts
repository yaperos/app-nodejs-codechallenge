import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { AuthEntity } from '../entities/auth.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    const { password: hashPassword } = user;

    const match = await bcrypt.compare(password, hashPassword);

    if (!match) {
      return false;
    }

    return user;
  }

  login(user: UserEntity): AuthEntity {
    const { id, email } = user;
    const auth = new AuthEntity();

    auth.access_token = this.jwtService.sign({ email, sub: id });

    return auth;
  }
}
