import { Injectable } from '@nestjs/common';

@Injectable()
export class MsAntifraudService {
  getHello(): string {
    return 'Hello World!';
  }
}
