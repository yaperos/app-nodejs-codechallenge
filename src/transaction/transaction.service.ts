import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { KafkaProducerService } from '../common/kafka/kafka.producer';
import { CreateTransactionInput } from './dto/create-transaction.input';
import * as crypto from 'crypto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async createTransaction(input: CreateTransactionInput) {
    const transactionExternalId = crypto.randomUUID();

    // Busca el status "pendiente"
    const pendienteStatus = await this.prisma.transactionStatus.findUnique({
      where: { name: 'pendiente' },
    });

    if (!pendienteStatus) {
      throw new Error('Estado "pendiente" no definido en la base de datos');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        transactionExternalId,
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        transferTypeId: input.transferTypeId,
        statusId: pendienteStatus.id,
        value: input.value,
      },
    });

    await this.kafkaProducer.sendMessage('transactions', {
      transactionExternalId,
      value: input.value,
    });

    return transaction;
  }

  async getTransaction(transactionExternalId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionExternalId },
      include: {
        transferType: true,
        transactionStatus: true,
      },
    });

    if (!transaction) return null;

    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transferType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  async updateTransactionStatus(
    transactionExternalId: string,
    status: 'aprobado' | 'rechazado',
  ) {
    const statusRecord = await this.prisma.transactionStatus.findUnique({
      where: { name: status },
    });

    if (!statusRecord) {
      throw new Error(`Status "${status}" no encontrado en la base de datos`);
    }

    return this.prisma.transaction.update({
      where: { transactionExternalId },
      data: { statusId: statusRecord.id },
    });
  }

}
