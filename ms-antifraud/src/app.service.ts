import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './dto/transaction-created.event';
import { validateTransaction } from "./utils";
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }


}
