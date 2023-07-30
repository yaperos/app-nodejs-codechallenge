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

    await lastValueFrom(this.kafkaClient.emit('transactions', transaction));
    return transaction;
  }
  async complete(id: string, status: TransactionStatus) {
    return await this.prismaService.transaction.update({
      where: { transaction_external_id: id },
      data: { status },
    });
  }
}
