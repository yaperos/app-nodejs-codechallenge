import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction-created.event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleTransactionCreated(transactionCreatedEvent: TransactionCreatedEvent) {
    // TODO: Validar transacciones y sus respectivos montos y aplicar lógica, luego enviar un update según corresponda.
    console.log(transactionCreatedEvent);
  }
}
