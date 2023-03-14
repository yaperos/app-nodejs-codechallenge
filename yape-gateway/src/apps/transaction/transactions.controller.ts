import { Controller, Logger, Post } from '@nestjs/common';
import { Body, Get, Param, Query } from '@nestjs/common/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionSwaggerResponse } from '@core/config/swagger/response';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetOneTransactionParam } from './dto/find-transaction.dto';
import { TransactionsService } from './transactions.service';
import { PageOptionsDto } from '../../core/types/pagination';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  @ApiResponse(TransactionSwaggerResponse.create)
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    this.logger.log('Create Transaction');
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get()
  @ApiResponse(TransactionSwaggerResponse.list)
  listTransaction(@Query() pageOptionsDto: PageOptionsDto) {
    this.logger.log('List Transaction');
    return this.transactionService.getTransactions(pageOptionsDto);
  }

  @Get(':id')
  @ApiResponse(TransactionSwaggerResponse.findOne)
  getTransactionById(@Param() param: GetOneTransactionParam) {
    this.logger.log('Get Transaction by transactionExternalId');
    return this.transactionService.getTransactionById(param.id);
  }
}
