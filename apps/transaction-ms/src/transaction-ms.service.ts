import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionMsService {
  getHello(): string {
    return 'Hello World!';
  }
}
