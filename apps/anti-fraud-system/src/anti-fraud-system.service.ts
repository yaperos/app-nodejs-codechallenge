import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudSystemService {
  getHello(): string {
    return 'Hello World!';
  }
}
