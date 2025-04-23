import {
  CreateTransactionDto,
  KAFKA_TOPICS,
  TransactionResponseDto,
} from '@app/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { BaseKafkaService } from '../common/base-kafka.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService extends BaseKafkaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('KAFKA_SERVICE') kafkaClient: ClientKafka,
  ) {
    super(kafkaClient);
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        value: createTransactionDto.value,
        transactionTypeId: createTransactionDto.tranferTypeId,
        statusCode: 'pending',
      },
      include: {
        transactionType: true,
        status: true,
      },
    });

    // Emit event to Kafka for anti-fraud validation
    const message = {
      key: transaction.externalId,
      value: {
        transactionId: transaction.externalId,
        value: Number(transaction.value),
      },
    };

    this.kafkaClient.emit(KAFKA_TOPICS.TRANSACTION_CREATED, message);

    return {
      transactionExternalId: transaction.externalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.status.name,
      },
      value: Number(transaction.value),
      createdAt: transaction.createdAt,
    };
  }

  async updateTransactionStatus(transactionId: string, statusCode: string) {
    const transaction = await this.prisma.transaction.update({
      where: { externalId: transactionId },
      data: { statusCode },
      include: {
        transactionType: true,
        status: true,
      },
    });

    return {
      transactionExternalId: transaction.externalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.status.name,
      },
      value: Number(transaction.value),
      createdAt: transaction.createdAt,
    };
  }

  async getTransaction(externalId: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { externalId },
      include: {
        transactionType: true,
        status: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${externalId} not found`,
      );
    }

    return {
      transactionExternalId: transaction.externalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.status.name,
      },
      value: Number(transaction.value),
      createdAt: transaction.createdAt,
    };
  }

  async getAllTransactions(): Promise<TransactionResponseDto[]> {
    const transactions = await this.prisma.transaction.findMany({
      include: {
        transactionType: true,
        status: true,
      },
    });

    return transactions.map(transaction => ({
      transactionExternalId: transaction.externalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.status.name,
      },
      value: Number(transaction.value),
      createdAt: transaction.createdAt,
    }));
  }
}
