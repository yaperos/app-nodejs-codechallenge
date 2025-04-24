import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/transaction/infrastructure/prisma/prisma.service';
import { AntifraudProducer } from '@/modules/transaction/infrastructure/kafka/antifraud.producer';
import { CreateTransactionInput } from '@/modules/transaction/infrastructure/graphql/dto/create-transaction.input';
import { TransactionWithRelations } from '@/modules/transaction/domain/entities/transaction.types';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly antifraudProducer: AntifraudProducer,
  ) {}

  async execute(input: CreateTransactionInput): Promise<TransactionWithRelations> {
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

    await this.antifraudProducer.emitTransactionCreated(transaction);

    return transaction;
  }
}
