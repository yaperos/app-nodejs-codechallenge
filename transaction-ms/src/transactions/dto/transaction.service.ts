import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionInput } from './input/create-transaction.input';
import { TRANSACTIONS_SERVICE } from 'src/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TransactionEntity } from './entities/transaction.entity';
import { Transaction, TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTIONS_SERVICE)
    private readonly transactionsClient: ClientKafka,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.transactionsClient.subscribeToResponseOf('validate_transaction');
    await this.transactionsClient.connect();
  }

  async findOne(transactionExternalId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        transactionExternalId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async createTransaction(createTransactionInput: CreateTransactionInput) {
    let transaction: Transaction | null = null;

    try {
      transaction = await this.prisma.transaction.create({
        data: {
          ...createTransactionInput,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating transaction');
    }

    const payloadToValidate = {
      transactionExternalId: transaction.transactionExternalId,
      ...createTransactionInput,
    };

    try {
      const result = (await firstValueFrom(
        this.transactionsClient.send('validate_transaction', { transaction: payloadToValidate }),
      )) as { status: TransactionStatus };

      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: result.status },
      });

      return {
        ...transaction,
        status: result.status,
      };
    } catch (error) {
      console.error('Error validating transaction:', error);
      return transaction;
    }
  }
}
