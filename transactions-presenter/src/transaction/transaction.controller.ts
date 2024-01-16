import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionDto } from './dto/transaction.dto';

@ApiTags('Transactions')
@Controller()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post('/transaction')
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  handle(@Body() transaction: TransactionDto): Promise<string> {
    return this.service.createTransaction(transaction);
  }
}
