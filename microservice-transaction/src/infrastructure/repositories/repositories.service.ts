import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma/prisma.service';
import { Prisma, Transaction } from '@prisma/client';
import { TransactionRepository } from '@/domain/repositories/transaction.repository';
import { TransactionEntity } from '@/domain/model/transaction.model';
import { KafkaService } from '../kafka/kafka.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RepositoriesService implements TransactionRepository {
  constructor(
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}
  async insert(transaction: TransactionEntity): Promise<TransactionEntity> {
    const result = await this.prismaService.transaction.create({
      data: {
        transactionExternalId: transaction.transactionExternalId,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        tranferTypeId: 1,
        value: transaction.value,
        transactionType: transaction.transactionType,
        transactionStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    this.kafkaService.sendMessage(
      'transaction-producer',
      JSON.stringify(result),
    );
    this.logger.log('Send message', `${JSON.stringify(result)}`);
    return result;
  }

  findAll(): Promise<TransactionEntity[]> {
    return this.prismaService.transaction.findMany();
  }

  findById(id: string): Promise<TransactionEntity> {
    return this.prismaService.transaction.findUnique({
      where: {
        transactionExternalId: id,
      },
    });
  }

  updateContent(id: string, status: string): Promise<TransactionEntity> {
    return this.prismaService.transaction.update({
      where: {
        transactionExternalId: id,
      },
      data: {
        transactionStatus: status,
      },
    });
  }

  async createTransaction(params: {
    data: Prisma.TransactionCreateInput;
  }): Promise<Transaction> {
    const { data } = params;
    return this.prismaService.transaction.create({ data });
  }

  async getTransactions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionWhereUniqueInput;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }): Promise<Transaction[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.transaction.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
