import { BadRequestException } from '@nestjs/common';

export class InvalidTransactionFiltersError extends BadRequestException {
  constructor() {
    super('The filters must contain a least of one');
  }
}
