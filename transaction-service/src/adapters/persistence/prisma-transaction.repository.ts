import { Injectable } from '@nestjs/common';
import { Prisma, Transaction as PrismaTransaction } from '@prisma/client';
import { PrismaService } from '@infra/prisma/prisma.service';
import { JsonValue, OutboxMessage } from '@domain/outbox';
import { Transaction } from '@domain/transaction';
import { TransactionRepository } from '@ports/out/transaction-repository';

const toPrismaJson = (v: JsonValue): Prisma.InputJsonValue | Prisma.JsonNullValueInput =>
  v === null ? Prisma.JsonNull : (v as unknown as Prisma.InputJsonValue);

const mapTransaction = (record: PrismaTransaction): Transaction => ({
  transactionExternalId: record.transactionExternalId,
  accountExternalIdDebit: record.accountExternalIdDebit,
  accountExternalIdCredit: record.accountExternalIdCredit,
  transferTypeId: record.transferTypeId,
  value: Number(record.value),
  status: record.status,
  createdAt: record.createdAt,
});

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithOutbox(
    transaction: Transaction,
    outboxMessage: OutboxMessage,
  ): Promise<Transaction> {
    const created = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const prismaTransaction = await tx.transaction.create({
        data: {
          transactionExternalId: transaction.transactionExternalId,
          accountExternalIdDebit: transaction.accountExternalIdDebit,
          accountExternalIdCredit: transaction.accountExternalIdCredit,
          transferTypeId: transaction.transferTypeId,
          value: new Prisma.Decimal(transaction.value),
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
      });

      await tx.outbox.create({
        data: {
          topic: outboxMessage.topic,
          key: outboxMessage.key,
          payload: toPrismaJson(outboxMessage.payload),
          nextAttemptAt: outboxMessage.nextAttemptAt ?? new Date(),
        },
      });

      return prismaTransaction;
    });

    return mapTransaction(created);
  }

  async findByExternalId(
    transactionExternalId: string,
  ): Promise<Transaction | null> {
    const record = await this.prisma.transaction.findUnique({
      where: { transactionExternalId },
    });

    return record ? mapTransaction(record) : null;
  }

  async updateStatus(
    transactionExternalId: string,
    status: Transaction['status'],
  ): Promise<void> {
    await this.prisma.transaction.update({
      where: { transactionExternalId },
      data: { status },
    });
  }
}
