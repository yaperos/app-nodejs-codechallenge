import { BadRequestException } from '@nestjs/common';

export class InvalidTransactionTypeError extends BadRequestException {
  constructor() {
    super('Transaction Type must be exists');
  }
}
