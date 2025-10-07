import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from './models/transaction.model';
import { KafkaService } from '@/kafka/kafka.service';
import { FindTransactionOutput } from './dto/find-transaction.output';
import crypto from 'crypto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    // Generate idempotency key if not provided
    const idempotencyKey =
      createTransactionInput.idempotencyKey ||
      this.generateIdempotencyKey(createTransactionInput);

    // Check if transaction with this idempotency key already exists
    const existingTransaction = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTransaction) {
      this.logger.log(
        `Transaction with idempotency key ${idempotencyKey} already exists, returning existing`,
      );
      return existingTransaction;
    }

    // Create new transaction with idempotency key
    const transaction = await this.prisma.transaction.create({
      data: {
        ...createTransactionInput,
        idempotencyKey,
        status: 'PENDING',
      },
    });
    this.logger.log('Transaction created:', transaction);

    // Send to Kafka with idempotency key in message
    await this.kafkaService.sendMessage(
      'transaction',
      JSON.stringify(transaction),
    );

    return transaction;
  }

  /**
   * Generate a deterministic idempotency key from transaction data.
   * This ensures the same transaction data always produces the same key.
   */
  private generateIdempotencyKey(input: CreateTransactionInput): string {
    const data = `${input.accountExternalIdDebit}:${input.accountExternalIdCredit}:${input.transferTypeId}:${input.value}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<FindTransactionOutput | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) return null;
    return new FindTransactionOutput(transaction);
  }

  async update(
    updateTransactionInput: UpdateTransactionInput,
  ): Promise<Transaction> {
    const { id, ...data } = updateTransactionInput;
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }
}
