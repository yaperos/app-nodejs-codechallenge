import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { KafkaProducer } from '../kafka/kafka.producer';

const TOPIC_CREATED = 'transaction.created';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private producer: KafkaProducer,
  ) {}

  async create(dto: CreateTransactionDto) {
    const tx = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        transferTypeId: dto.tranferTypeId,
        value: dto.value,
        status: 'pending',
      },
    });

    await this.producer.send(TOPIC_CREATED, tx.transactionExternalId, {
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      transactionExternalId: tx.transactionExternalId,
      accountExternalIdDebit: tx.accountExternalIdDebit,
      accountExternalIdCredit: tx.accountExternalIdCredit,
      transferTypeId: tx.transferTypeId,
      value: tx.value,
    });

    return { transactionExternalId: tx.transactionExternalId, status: tx.status };
  }

  async get(transactionExternalId: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { transactionExternalId },
    });
    if (!tx) throw new NotFoundException('Transaction not found');

    return {
      transactionExternalId: tx.transactionExternalId,
      transactionType: { name: `type-${tx.transferTypeId}` },
      transactionStatus: { name: tx.status },
      value: tx.value,
      createdAt: tx.createdAt,
    };
  }
}
