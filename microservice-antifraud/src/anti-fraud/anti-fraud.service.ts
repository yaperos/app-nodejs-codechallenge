import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventPatternEvents } from 'src/constants/event-pattern-events';
import { TransactionStatus } from 'src/constants/transaction-status';
import { UpdateTransactionDTO } from './structure/dto/UpdateTransactionDTO';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('TRANSACTION_API_MS')
    private readonly clientKafka: ClientKafka,
  ) {}

  transactionValidate(data: UpdateTransactionDTO) {
    const transactionResponse = {
      id: data.id,
      status:
        Number(data.value) > 1000
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED,
    };

    this.clientKafka.emit(
      EventPatternEvents.UpdateTransaction,
      JSON.stringify(transactionResponse),
    );
  }
}
