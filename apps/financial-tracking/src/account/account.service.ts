import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountDto } from './account.dto';
import { AccountStatus } from '.prisma/client/financial-tracking';

@Injectable()
export class AccountService {
  constructor(private prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.account.findMany();
  }

  async create(data: AccountDto) {
    return await this.prismaService.account.create({
      data: {
        ...data,
        status: AccountStatus.ACTIVE,
      },
    });
  }
}
