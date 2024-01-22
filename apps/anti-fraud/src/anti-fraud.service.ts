import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  getHello(): string {
    return 'Hello Anti-fraud!';
  }
}
