import { Body, Controller, Get, Param, Post, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionCreateDTO } from 'src/dtos/transaction.create.dto';
import { TransactionGetDTO } from 'src/dtos/transaction.get.dto';
import { TransactionUpdateDTO } from 'src/dtos/transaction.update.dto';
import { TransactionService } from 'src/services/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':transactionExternalId')
  async getById(@Param() params: TransactionGetDTO) {
    return await this.transactionService.getById(params.transactionExternalId)
  }

  @Post()
  async create(@Body() body: TransactionCreateDTO) {
    return await this.transactionService.create(body)
  }

  @MessagePattern('transaction-verified')
  async updateStatus(@Payload('value') data: TransactionUpdateDTO) {
    Logger.log('[updateStatus] Verfied Transaction received:', data);
    const transaction = await this.transactionService.updateStatus(data);
    Logger.log('[updateStatus] Transaction updated:', transaction);
  }
}
