import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionService } from '../services/transaction-ms.service';
import { FindOneParams } from '../dtos/find-transaction.dto';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions',
    type: Transaction,
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '1f4ab17b-8548-4b76-a7fd-c94fc0b95b77',
  })
  findOne(@Param() params: FindOneParams): Promise<Transaction> {
    return this.transactionService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created',
    type: Transaction,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'The status or type of the transaction is not valid',
  })
  @ApiBody({ type: CreateTransactionDto })
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto);
  }
}
