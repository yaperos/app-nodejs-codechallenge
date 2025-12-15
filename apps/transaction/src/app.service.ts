import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    public readonly prisma: PrismaService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createTransaction(data: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: {
        accountExternalIdDebit: data.accountExternalIdDebit,
        accountExternalIdCredit: data.accountExternalIdCredit,
        transferTypeId: data.transferTypeId,
        value: data.value,
        status: 'PENDING',
      },
    });

    console.log(
      `[Transaction] Creada en DB: ${transaction.id}. Enviando a Kafka...`,
    );

    this.kafkaClient.emit(
      'transaction_created',
      JSON.stringify({
        transactionExternalId: transaction.id,
        value: transaction.value,
      }),
    );

    return transaction;
  }

  async handleTransactionStatusUpdate(data: any) {
    let transactionData = data;

    if (typeof data === 'string') {
      transactionData = JSON.parse(data);
    }

    console.log(
      `[Transaction] Recibido update para ${transactionData.transactionExternalId}. Nuevo estado: ${transactionData.status}`,
    );

    await this.prisma.transaction.update({
      where: {
        id: transactionData.transactionExternalId,
      },
      data: {
        status: transactionData.status as TransactionStatus, 
      },
    });

    console.log(`[Transaction] DB actualizada correctamente.`);
  }
}
