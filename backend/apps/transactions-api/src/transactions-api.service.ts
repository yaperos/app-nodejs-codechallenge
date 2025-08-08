import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
