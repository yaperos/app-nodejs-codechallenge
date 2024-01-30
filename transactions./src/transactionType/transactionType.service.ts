import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionTypeDto } from './dto';

@Injectable()
export class TransactionTypeService {
  constructor(private prisma: PrismaService) {}

  async createTransactionType(
    dto: CreateTransactionTypeDto,
  ) {
    const transactionType =
      await this.prisma.transactionType.create({
        data: {
          ...dto,
        },
      });

    return transactionType;
  }
  async getAll() {
    const transactionTypes =
      await this.prisma.transactionType.findMany();
    return transactionTypes;
  }
}
