import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStatusTransactionDto } from './dto';

@Injectable()
export class StatusTransactionService {
  constructor(private prisma: PrismaService) {}

  async createStatusTransaction(
    dto: CreateStatusTransactionDto,
  ) {
    const statusTransaction =
      await this.prisma.statusTransaction.create({
        data: dto,
      });

    return statusTransaction;
  }
  async getAll() {
    const statusTransactions =
      await this.prisma.statusTransaction.findMany();
    return statusTransactions;
  }
}
