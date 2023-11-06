import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ITransactionResponse } from './interfaces/transaction.interface';

@Injectable()
export class AntiFraud {
  constructor(
    @Inject('YAPE')
    private readonly kafka: ClientProxy,
  ) {}

  public emitMessage(transaction: ITransactionResponse[]) {
    this.kafka.emit('Transaction', JSON.stringify(transaction));
  }

  public emitMessageTransaction(transaction: ITransactionResponse[]) {
    this.kafka.emit('Anti-Fraud', JSON.stringify(transaction));
  }
}
