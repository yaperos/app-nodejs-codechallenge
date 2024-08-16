import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionsService } from '../services/transactions.service';
import { TransactionResponseDto } from 'src/dtos/transaction-response.dto';
import { TransactionIdParamDto } from 'src/dtos/tansactionId-param.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionDto } from 'src/dtos/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post()
  async create(@Body() transaction: TransactionDTO): Promise<TransactionDTO> {
    return await this.transactionService.createTransaction(transaction);
  }

  @Get(':transactionExternalId')
  async getTransaction(
    @Param(new ValidationPipe()) params: TransactionIdParamDto,
  ): Promise<TransactionResponseDto> {
    const { transactionExternalId } = params;

    return this.transactionService.getTransactionByExternalId(
      transactionExternalId,
    );
  }

  @MessagePattern('transaction-update')
  async handleEventUpdateTransaction(@Payload() data: UpdateTransactionDto) {
    const { transactionExternalId, status } = data;
  }
}
