import { Controller, Post, Body, Get, Param, ParseUUIDPipe, HttpCode, HttpStatus, Logger, ValidationPipe, UsePipes } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/create-transaction-response.dto';

@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    this.logger.log(`Received request to create transaction: ${JSON.stringify(createTransactionDto)}`);

    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTransaction(
    @Param('id', new ParseUUIDPipe({ version: '4' })) transactionExternalId: string,
  ): Promise<TransactionResponseDto> {
    this.logger.log(`Received request to get transaction by external ID: ${transactionExternalId}`);

    return this.transactionService.getTransactionFromCache(transactionExternalId);
  }
}