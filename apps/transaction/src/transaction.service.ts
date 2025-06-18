import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  getHello(): string {
    return 'Hello World!';
  }
}
