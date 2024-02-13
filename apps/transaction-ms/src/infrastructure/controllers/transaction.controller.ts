import { Controller, Get, Inject, Param } from '@nestjs/common';
import { TransactionService } from '../../domain/services/transaction.service';
import { Token } from '../constants';
import { TransactionTypeService } from '../../domain/services/transaction-type.service';
import {
  ResponseTransactionDto,
  getTransactionResponseDto,
} from '../dto/response-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(Token.TRANSACTION)
    private readonly transactionService: TransactionService,
    @Inject(Token.TRANSACTION_TYPE)
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ResponseTransactionDto> {
    const transaction = await this.transactionService.getOne(id);
    const transactionType = await this.transactionTypeService.findOne(
      transaction.transactionTypeId,
    );

    return getTransactionResponseDto(transaction, transactionType);
  }
}
