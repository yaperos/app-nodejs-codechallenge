import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudMsService {
  getHello(): string {
    return 'Hello World2!';
  }
}
