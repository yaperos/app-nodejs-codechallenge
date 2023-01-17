import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDTO } from 'src/transaction/models/create-transaction.dto';
import { TransactionApprovedEvent } from './models/transaction-approved.event';
import { TransationService } from './transaction.service';

@Controller('/transactions')
export class TransactionController {
  constructor(private readonly service: TransationService) {}

  @Post()
  async create(@Body() data: CreateTransactionDTO): Promise<any> {
    await this.service.create(data);
  }

  @Get()
  async find(): Promise<any> {
    return this.service.find();
  }

  @MessagePattern('transaction.approved')
  async transactionApproved(
    @Payload() payload: TransactionApprovedEvent,
  ): Promise<void> {
    Logger.debug(payload);
    await this.service.approveTransaction(payload.transactionExternalId);
  }

  @MessagePattern('transaction.rejected')
  async transactionRejected(@Payload() payload: any): Promise<void> {
    Logger.debug(payload);
    await this.service.rejectTransaction(payload.transactionExternalId);
  }
}
