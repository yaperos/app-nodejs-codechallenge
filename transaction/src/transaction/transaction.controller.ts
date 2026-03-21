import { Controller, Post, Body, NotFoundException, Param, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './models/create-transaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<void> {
    await this.transactionService.create(dto);
  }

   @Get()
  async find(): Promise<any> {
    return this.transactionService.find();
  }

  @MessagePattern('transaction.approved')
  async transactionApproved(
    @Payload() payload: any,
  ): Promise<void> {
    await this.transactionService.approveTransaction(payload.transactionExternalId);
  }

  @MessagePattern('transaction.rejected')
  async transactionRejected(@Payload() payload: any): Promise<void> {
    await this.transactionService.rejectTransaction(payload.transactionExternalId);
  }
}