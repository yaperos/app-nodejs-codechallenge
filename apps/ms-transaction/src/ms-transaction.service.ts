import { Injectable } from '@nestjs/common';

@Injectable()
export class MsTransactionService {
  getHello(): string {
    return 'Hello World!';
  }
}
