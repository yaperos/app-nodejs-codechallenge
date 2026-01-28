import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Transaction Anti-Fraud Service is running!';
  }
}