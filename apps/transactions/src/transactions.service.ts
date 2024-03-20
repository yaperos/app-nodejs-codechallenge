import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TransactionDto } from './transaction.dto';
import { TransactionStatus } from '.prisma/client/transactions';

@Injectable()
export class TransactionsService {
  constructor(private prismaService: PrismaService) {}

  async all() {
    const transactions = await this.prismaService.transaction.findMany({
      include: {
        TransactionType: true,
      },
    });

    const transactionResponse = transactions.map((transaction) => {
      return {
        transactionExternalId: transaction.id,
        transactionType: {
          name: transaction.TransactionType.type,
        },
        transactionStatus: {
          name: transaction.status,
        },
        value: transaction.amount,
        createdAt: transaction.createdAt,
      };
    });

    return transactionResponse;
  }

  async create(data: TransactionDto) {
    return await this.prismaService.transaction.create({
      data: {
        amount: data.value,
        account_id: data.accountExternalId,
        transaction_type_id: data.transactionTypeId,
        status: TransactionStatus.PENDING,
      },
    });
  }

  async complete({
    transaction_id,
    status,
  }: {
    transaction_id: string;
    status: TransactionStatus;
  }) {
    return await this.prismaService.transaction.update({
      where: { id: transaction_id },
      data: { status },
    });
  }
}
