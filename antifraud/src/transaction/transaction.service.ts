import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '../core/kafka/kafka-producer.service';

import { ConsumeTransactionDto } from './dto/consume-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';

const AMOUNT_LIMIT = 1000;
const STATUS_APPROVED = 'APPROVED';
const STATUS_REJECTED = 'REJECTED';

@Injectable()
export class TransactionService {
  constructor(
    private kafkaProducerService: KafkaProducerService,
  ) {}
  async checkFraud(dto: ConsumeTransactionDto) {
    try {
      await this.kafkaProducerService.emit(
        'transaction-status-update',
        {
          transactionId: dto.transactionId,
          status: isAmountValid(dto.amount)
            ? STATUS_APPROVED
            : STATUS_REJECTED,
        },
      );
    } catch (error) {
      console.error(
        'Failed to emit transaction:',
        error,
      );
      throw new Error('Kafka emit failed'); // This will cause the transaction to rollback
    }

    return dto;
  }
}
function isAmountValid(amount: number): boolean {
  console.log(amount < AMOUNT_LIMIT);
  console.log(amount);
  console.log(AMOUNT_LIMIT);
  return amount < AMOUNT_LIMIT;
}
