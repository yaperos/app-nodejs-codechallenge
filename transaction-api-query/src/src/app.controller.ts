import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { TransactionService } from './transaction/transaction.service';

@Controller('/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/:id')
  async getById(@Param('id') id: string) {
    try {
      const transaction = await this.transactionService.getById(id);
      return transaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'The transaction could not be retrieved, please try again later.',
      );
    }
  }
}
