import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { LoginDto, RegisterDto, UserDTO } from 'src/dto/create-user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register({ password, email, name }: RegisterDto) {
    const user = await this.usersRepository.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email Already Exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      message: 'User Created Successfully',
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = { email: user.email, userId: user.userId };
    const token = await this.jwtService.signAsync(payload);

    return {
      email: user.email,
      token: token,
    };
  }

  async findByUserId({ userId }: UserDTO) {
    const user = await this.usersRepository.findUserId(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid User');
    }

    return user;
  }
}
