import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiTransactionsService {
  getHello(): string {
    return 'Hello World!';
  }
}
