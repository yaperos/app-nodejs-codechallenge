import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        ...dto,
      },
    });

    return user;
  }
  async getAll() {
    const users =
      await this.prisma.user.findMany();
    return users;
  }
}
