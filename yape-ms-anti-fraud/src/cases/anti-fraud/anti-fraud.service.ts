import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  constructor() {}

  ping(): string {
    return 'pong';
  }
}
