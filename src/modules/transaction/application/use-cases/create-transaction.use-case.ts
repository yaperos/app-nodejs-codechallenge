import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/transaction/infrastructure/prisma/prisma.service';
import { AntifraudProducer } from '@/modules/transaction/infrastructure/kafka/antifraud.producer';
import { CreateTransactionInput } from '@/modules/transaction/infrastructure/graphql/dto/create-transaction.input';
import { TransactionWithRelations } from '@/modules/transaction/domain/entities/transaction.types';

/**
 * Use case for creating a new transaction.
 * Handles database persistence and emits a Kafka event for antifraud processing.
 */
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly antifraudProducer: AntifraudProducer,
  ) {}

  /**
   * Executes the transaction creation process.
   * 
   * @param input - Transaction input data received from the client.
   * @returns The created transaction with its related entities.
   */
  async execute(input: CreateTransactionInput): Promise<TransactionWithRelations> {
    // Create the transaction with initial status "pending" (ID: 1)
    const transaction = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        transferTypeId: input.transferTypeId,
        value: input.value,
        transactionStatusId: 1, // Pending
      },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });
    
    // Emit event to Kafka for antifraud service to process asynchronously
    await this.antifraudProducer.emitTransactionCreated(transaction);

    return transaction;
  }
}
