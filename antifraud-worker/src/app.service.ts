import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  transactionValidation(): string {
    return 'Hello World!';
  }

}
