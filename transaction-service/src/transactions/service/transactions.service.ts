import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import Redis from 'ioredis';
import { KafkaProducer } from 'src/kafka/kafka.producer';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private readonly kafkaProducer: KafkaProducer,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async create(dto, idempotencyKey: string) {
    const rediskey = `idem:${idempotencyKey}`;
    // 1. verify idempotence
    const existing = await this.redis.get(rediskey);
    if (existing) {
      console.log('Transaction already registered');
      return JSON.parse(existing);
    }

    // 2. create transaction
    const transactionId = randomUUID();

    const transaction = await this.prisma.transaction.create({
      data: {
        id: transactionId,
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        tranferTypeId: dto.tranferTypeId,
        value: dto.value,
        status: 'pending',
      },
    });

    // 3. save idempotence
    await this.redis.set(rediskey, JSON.stringify(transaction), 'EX', 300);

    // 4. publish in kakfa
    console.log('Send to antifraud: ', transactionId);
    await this.kafkaProducer.emit('transaction.created', {
      transactionId,
      accountExternalIdDebit: dto.accountExternalIdDebit,
      accountExternalIdCredit: dto.accountExternalIdCredit,
      value: dto.value,
    });

    return transaction;
  }

  async getById(id: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
    });

    return {
      transactionExternalId: tx.id,
      transactionType: {
        name: 'transfer',
      },
      transactionStatus: {
        name: tx.status,
      },
      value: tx.value,
      createdAt: tx.createdAt,
    };
  }

  async update(data) {
    console.log('update transaction: ', data.transactionId);
    await this.prisma.transaction.update({
      where: { id: data.transactionId },
      data: { status: data.status },
    });
  }
}
