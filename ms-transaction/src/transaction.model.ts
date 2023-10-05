import { Injectable } from '@nestjs/common';
import { Prisma, STATUS } from '@prisma/client';
import { TransactionServices } from '@src/transaction.services';
import { KafkaConfigService } from '@src/core/services/kafka-config.services';
import { TOPICS } from '@src/core/constants/kafka.constant';
import { TRANSACTION_TYPE } from '@src/core/constants/transaction.constant';

@Injectable()
export class TransactionModel {
  constructor(
    private transactionServices: TransactionServices,
    private kafkaConfigService: KafkaConfigService,
  ) {}

  public async transactions() {
    const traansactions = await this.transactionServices.transactions();
    return traansactions.map((transaction) => ({
      transactionExternalId: transaction.id,
      transactionType: {
        name: TRANSACTION_TYPE[transaction.tranferTypeId],
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    }));
  }

  public async transaction(id: string) {
    const transaction = await this.transactionServices.transaction(id);
    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: TRANSACTION_TYPE[transaction.tranferTypeId],
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  public async createTransaction(
    transactionData: Prisma.TransactionCreateInput,
  ) {
    const transaction = await this.transactionServices.createTransaction({
      ...transactionData,
      status: STATUS.PENDING,
    });
    await this.kafkaConfigService.createProducer({
      topic: TOPICS.TRANSACTION_VALIDATION,
      messages: [
        {
          value: JSON.stringify({
            transaction_id: transaction.id,
            value: transaction.value,
            status: transaction.status,
          }),
        },
      ],
    });

    return transaction;
  }
}
