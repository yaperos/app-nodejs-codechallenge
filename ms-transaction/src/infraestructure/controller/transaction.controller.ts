import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, UsePipes } from '@nestjs/common';
import { TransactionUseCase } from 'src/application/transaction';
import { TransactionRequest, TransactionResponse } from 'src/helper/type.helper';
import { ProducerService } from '../message/kafka/producer.service';
import { EventPattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { CreateTransactionDto } from './transaction.validation';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger('transactionController');
  constructor(
    private readonly transactionUseCase: TransactionUseCase,
    private readonly producerService: ProducerService,
  ) {}

  @Post()
  async registerTransaction(@Body() data: CreateTransactionDto) {
    const result = await this.transactionUseCase.registerTrx(data);
    const jsonString = JSON.stringify(result);
    this.logger.log('data emitida',result);
    await this.producerService.produce('transactionTopic', {
      value: jsonString,
    });
    return result;
  }

  @Get(':id')
  async getTransaction(  
    @Param('id', new ParseUUIDPipe())
    id: string
    ):Promise<TransactionResponse> {
    const result = await this.transactionUseCase.findTrx(id);
    return result;
  }

  @EventPattern('transactionValidateTopic')
  handleMyEvent(data: any): void {
    this.transactionUseCase.updateStatus(data.id, data.newStatus);
    this.logger.log('data recibida',data);
  } 
}
