import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { TransactionService } from './transaction/transaction.service';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsPositive()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}

/**
 * We might want to use hexagonal architecture to decouple technology from the business logic. but for now, we will keep it simple.
 */
@Controller('/transaction')
export class TransactionController {
  constructor(private readonly appService: TransactionService) {}

  @Post()
  async create(@Body() transaction: TransactionDto) {
    try {
      const newTransaction = {
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        transferTypeId: transaction.tranferTypeId,
        value: transaction.value,
      };

      return await this.appService.create(newTransaction);
    } catch (error) {
      throw new InternalServerErrorException(
        'The transaction could not be created, please try again later.',
      );
    }
  }
}
