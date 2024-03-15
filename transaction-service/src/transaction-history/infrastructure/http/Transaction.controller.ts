import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ITransactionService } from '../../application/services/ITransactionService';
import { TransactionCreate } from './types/Transaction.types';

@ApiTags('API to manage transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: ITransactionService) {}

  @ApiResponse({
    status: '2XX',
  })
  @ApiResponse({
    status: '5XX',
  })
  @ApiOperation({
    summary: 'Register new Transaction',
    description:
      'Verify that the transaction type exists and created if it not exists',
  })
  @Post('/status')
  async createTransactionStatus(
    @Body() transaction: TransactionCreate,
  ): Promise<any> {
    return this.service.createTransaction(transaction);
  }
}
