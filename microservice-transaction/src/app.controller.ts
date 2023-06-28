import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionVerified } from './domain/transaction';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Post('/transaction')
  public async initTransaction(
    @Body() transactionDto: TransactionDto
  ) {
    return await this.appService.saveTransaction(transactionDto);
  }

  @MessagePattern('KAFKA_TOPIC_TRANSACTION_VERIFIED')
  public async transactionVerified(@Payload() payload: TransactionVerified){ 
    Logger.log('Iniciando Actualizacion');
    await this.appService.updateTransaction(payload);
  }
}
