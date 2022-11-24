import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionEvent } from 'src/transactionEvent';

@Injectable()
export class AppService {
  
  constructor(
    @Inject('ANTI-FRAUD') private readonly antiFraud: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  handleTrasactionCreated(data: TransactionEvent) {
    console.log(data);
  }
}