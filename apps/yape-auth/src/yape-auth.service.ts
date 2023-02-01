import { Injectable } from '@nestjs/common';

@Injectable()
export class YapeAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
