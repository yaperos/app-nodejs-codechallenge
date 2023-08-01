import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { KafkaService } from '../shared/kafka/kafka.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { GetTransactionDTO } from './dto/get-transaction.dto';
import { PENDING } from './entities/transaction-status';
import { KafkaStreamPatterns } from '../shared/kafka/kafka-stream-patterns';

@Injectable()
export class TransactionService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const newTransaction = await this.prismaService.transaction.create({
      data: {
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        transferTypeId: createTransactionDto.transferTypeId,
        value: createTransactionDto.value,
        transactionStatus: PENDING,
      },
    });
    this.kafkaService.sendMessage(
      KafkaStreamPatterns.pendingTransactions,
      newTransaction,
    );
    return newTransaction;
  }

  async pullProcessedTransaction(transaction: UpdateTransactionDto) {
    const updatedTransaction = await this.prismaService.transaction.update({
      where: {
        transactionExternalId: transaction.transactionExternalId,
      },
      data: {
        transactionStatus: transaction.transactionStatus,
      },
    });
    console.log(updatedTransaction);
  }

  async getTransaction(getTransaction: GetTransactionDTO) {
    return this.prismaService.transaction.findFirst({
      where: {
        transactionExternalId: getTransaction.transactionExternalId,
        transferType: {
          transferTypeName: getTransaction.transactionType?.name,
        },
        transactionStatus: getTransaction.transactionStatus?.name,
        value: getTransaction.value,
        createdAt: getTransaction.createdAt,
      },
    });
  }
}
