import { Injectable } from '@nestjs/common';
import { ITransactionService } from '../ITransactionService';
import { IKafkaProducer } from '../../../domain/stream/producer/IKafkaProducer';
import { TransactionDTO } from '../../dto/TransactionDTO';
import { TransactionStatus } from '../../../domain/enums/TransactionStatus';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(private readonly producer: IKafkaProducer) {}

  async evaluateTransaction(transaction: TransactionDTO): Promise<void> {
    if (transaction.value && transaction.value > 1000) {
      await this.producer.sendMessage({
        transactionExternalId: transaction.transactionExternalId,
        status: TransactionStatus.REJECTED,
      });
    } else {
      await this.producer.sendMessage({
        transactionExternalId: transaction.transactionExternalId,
        status: TransactionStatus.APPROVED,
      });
    }
  }
}
