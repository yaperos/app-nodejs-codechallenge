import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma.service';
import { Transaction, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async transaction(id: string): Promise<Transaction> {
    return this.prisma.transaction.findUnique({
      where: {
        transactionExternalId: id,
      },
    });
  }

  async create(data: CreateTransactionDto): Promise<Transaction> {

    return this.prisma.transaction.create({
      data: {
        transactionExternalId: uuidv4(),
        accountExternalIdDebit: data.accountExternalIdDebit,
        accountExternalIdCredit: data.accountExternalIdCredit,
        transactionType: data.tranferTypeId,
        transactionTypeName: "TRANSFERENCE",
        value: data.value,
        createdAt: new Date()
      }
    });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: {
        transactionExternalId: id,
      },
      data: {
        transactionStatus: updateTransactionDto.transactionStatus,
      },
    });
  }

}
