import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma/prisma.service';
import { TransactionDto } from './transaction.dto';
import { TransactionStatus } from '.prisma/client/transactions';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class TransactionsService {
  constructor(
    private prismaService: PrismaService,
    @Inject('TRANSACTIONS_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  all() {
    return this.prismaService.transaction.findMany();
  }
  async create(data: TransactionDto) {
    try {
      const transaction = await this.prismaService.transaction.create({
        data: {
          transaction_external_id: data.accountExternalIdCredit
            ? data.accountExternalIdCredit
            : data.accountExternalIdDebit,
          transaction_type: data.tranferTypeId,
          value: data.value,
          status: TransactionStatus.PENDING,
          updated_at: new Date(),
        },
      });
      await lastValueFrom(
        this.kafkaClient.emit('transactions', JSON.stringify(transaction)),
      );
      return transaction;
    } catch (e: any) {
      return {
        message: 'ID duplicated',
      };
    }
  }
  async findByID(id: string) {
    const transaction = await this.prismaService.transaction.findFirst({
      where: {
        transaction_external_id: id,
      },
    });
    if (transaction) {
      return {
        transactionExternalId: transaction.transaction_external_id,
        transactionType: {
          name: transaction.transaction_type,
        },
        transactionStatus: {
          name: transaction.status,
        },
        value: transaction.value,
        createdAt: transaction.created_at,
      };
    } else {
      return { message: 'Id not found' };
    }
  }

  async complete(id: string, status: TransactionStatus) {
    return await this.prismaService.transaction.update({
      where: { transaction_external_id: id },
      data: { status },
    });
  }
}
