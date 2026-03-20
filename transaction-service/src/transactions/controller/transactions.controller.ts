import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  async create(
    @Body() dto: CreateTransactionDto,
    @Headers('idempotency-key') key: string,
  ) {
    console.log('Request to register transaction');
    const transaction = await this.service.create(dto, key);

    return {
      transactionId: transaction.id,
      status: transaction.status,
    };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.service.getById(id);
  }
}
