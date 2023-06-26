import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {TransactionCreateDTO} from 'src/transaction/dtos/transaction.create.dto';
import {TransactionGetDTO} from 'src/transaction/dtos/transaction.get.dto';
import {TransactionUpdateDTO} from 'src/transaction/dtos/transaction.update.dto';
import {TransactionService} from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':transactionExternalId')
  async getById(@Param() params: TransactionGetDTO) {
    return await this.transactionService.getById(params.transactionExternalId);
  }

  @Post()
  async create(@Body() body: TransactionCreateDTO) {
    return await this.transactionService.create(body);
  }

  @MessagePattern('transaction-verified')
  async updateStatus(@Payload() data: TransactionUpdateDTO) {
    console.log('[updateStatus] Verfied Transaction received:', data);
    const transaction = await this.transactionService.updateStatus(data);
    const formatedTransaction = JSON.stringify(transaction);
    console.log('[updateStatus] Transaction updated:', formatedTransaction);
  }
}
