import { Injectable } from '@nestjs/common';

@Injectable()
export class AntifraudService {
  handleTransactionCreated(transactionCreatedEvent) {
    console.log('hola', transactionCreatedEvent);
  }
}
