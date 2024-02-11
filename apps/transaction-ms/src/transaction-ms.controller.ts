import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionMsService } from './transaction-ms.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionMsController {
  constructor(private readonly transactionMsService: TransactionMsService) {}

  @Get(':transactionExternalId')
  @ApiOperation({ summary: 'Get a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions',
    type: Transaction,
  })
  @ApiParam({
    name: 'transactionExternalId',
    required: true,
    example: '1f4ab17b-8548-4b76-a7fd-c94fc0b95b77',
  })
  findOne(
    @Param('transactionExternalId') transactionExternalId: string,
  ): Promise<Transaction> {
    return this.transactionMsService.findOne(transactionExternalId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created',
    type: Transaction,
  })
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionMsService.create(createTransactionDto);
  }
}
