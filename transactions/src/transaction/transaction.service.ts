import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction as Trx } from '@prisma/client';
import { Transaction } from './entities/transaction.entity';
import { PrismaService } from '../prisma/prisma.service';
import { ClientKafka } from '@nestjs/microservices';
import { logger } from 'src/datadog';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    @Inject('kafk_client_transaction') private readonly client: ClientKafka,
  ) {}
  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction | null> {
    function createFakeTransaction() {
      const transaction = {
        transactionExternalId: generateRandomId(),
        accountExternalIdDebit: generateRandomId(),
        accountExternalIdCredit: generateRandomId(),
        tranferTypeId: generateRandomNumber(),
        value: generateRandomNumber(),
        transactionType: generateRandomWord(),
        transactionStatus: generateRandomWord(),
        createdAt: generateRandomDate(),
      };

      return transaction;
    }

    function generateRandomId() {
  
      return 'fake-id-' + Math.random().toString(36).substring(7);
    }

    function generateRandomNumber() {
      return Math.floor(Math.random() * 10000);
    }

    function generateRandomWord() {
      return Math.random().toString(36).substring(7);
    }

    function generateRandomDate() {
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear() - 10,
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const endDate = new Date();
      const randomTimestamp =
        startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime());

      return new Date(randomTimestamp);
    }

    createTransactionInput = createFakeTransaction();
    createTransactionInput.transactionStatus = "pending";
    console.log(createTransactionInput);
    const result = await this.prisma.transaction.create({
      data: createTransactionInput,
    });

    const response: Transaction = {
      accountExternalIdDebit: result.accountExternalIdDebit,
      accountExternalIdCredit: result.accountExternalIdCredit,
      tranferTypeId: result.tranferTypeId,
      value: result.value,
      transactionExternalId: result.transactionExternalId,
      transactionType: result.transactionType,
      transactionStatus: result.transactionStatus,
    };

    this.client.emit('transactions.created', JSON.stringify(response));
    return response;
  }

  async getById(id: string) {
    logger.log('info', { type: 'getById', id });
    const result = await this.prisma.transaction.findUnique({
      where: {
        transactionExternalId: id,
      },
    });
    console.log('results', result);
    const response: Transaction = {
      accountExternalIdDebit: result.accountExternalIdDebit,
      accountExternalIdCredit: result.accountExternalIdCredit,
      tranferTypeId: result.tranferTypeId,
      value: result.value,
      transactionExternalId: result.transactionExternalId,
      transactionType: result.transactionType,
      transactionStatus: result.transactionStatus,
      createdAt: result.createdAt,
    };
    logger.log('info', response);
    console.log(response);
    return response;
  }
}
