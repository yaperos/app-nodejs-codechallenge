import { Injectable } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
  TransactionRow,
} from '../../application/ports/transaction.repository.port.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { OUTBOX_EVENT_TRANSACTION_CREATED } from '../../../common/kafka/kafka.constants.js';
import type { TransactionCreatedEventPayload } from '../../domain/messaging/transaction-kafka.messages.js';

@Injectable()
export class PrismaTransactionRepository extends TransactionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createWithOutbox(input: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
  }): Promise<{ transactionExternalId: string }> {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          accountExternalIdDebit: input.accountExternalIdDebit,
          accountExternalIdCredit: input.accountExternalIdCredit,
          transferTypeId: input.transferTypeId,
          value: input.value,
          status: 'pending',
        },
      });

      const payload: TransactionCreatedEventPayload = {
        transactionExternalId: transaction.transactionExternalId,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        transferTypeId: transaction.transferTypeId,
        value: transaction.value,
        createdAt: transaction.createdAt.toISOString(),
      };

      await tx.outboxEvent.create({
        data: {
          aggregateId: transaction.transactionExternalId,
          eventType: OUTBOX_EVENT_TRANSACTION_CREATED,
          payload,
          status: 'pending',
        },
      });

      return { transactionExternalId: transaction.transactionExternalId };
    });
  }

  async findByExternalId(
    transactionExternalId: string,
  ): Promise<TransactionRow | null> {
    return this.prisma.transaction.findUnique({
      where: { transactionExternalId },
      include: { transferType: true },
    });
  }

  async updateStatusIfPending(
    transactionExternalId: string,
    status: 'approved' | 'rejected',
  ): Promise<void> {
    const row = await this.prisma.transaction.findUnique({
      where: { transactionExternalId },
    });
    if (!row) {
      return;
    }
    if (row.status !== 'pending') {
      if (row.status === status) {
        return;
      }
      return;
    }
    await this.prisma.transaction.update({
      where: { transactionExternalId },
      data: { status },
    });
  }
}
