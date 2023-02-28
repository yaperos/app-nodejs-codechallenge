import { Injectable } from '@nestjs/common';
import { TransactionEnum } from './enums/index';

@Injectable()
export class AppService {
  validateValue(value: number): boolean {
    if (value > TransactionEnum.MAX_VALUE) {
      return false;
    }
    return true;
  }
}
