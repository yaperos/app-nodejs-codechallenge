/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { TransactionRequestDto } from './dto/request/transaction.request.dto';
import { VERIFY_TRANSACTION_TOPIC } from './constans/kafka-topics';

@Controller('anti-fraud')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @EventPattern(VERIFY_TRANSACTION_TOPIC)
  handleVerifyTransaction(transactionRequestDto: TransactionRequestDto) {
    return this.appService.handleVerifyTransaction(transactionRequestDto);
  }
}
