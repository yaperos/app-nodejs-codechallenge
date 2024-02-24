import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionUpdateDto } from 'src/common/dto/transactionUpdateDto.dto ';
import { TransactionService } from 'src/core/service/transaction.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller()
export class TransactionListener {

  private readonly logger = new Logger(TransactionListener.name);

  constructor(private transactionService: TransactionService) {}

  @MessagePattern(process.env.TRANSACTION_UPDATE_TOPIC) 
  updateTransaction(@Payload() message: TransactionUpdateDto) {
    this.logger.log('topic-transaction-update -  traceId:'+ message.traceId + 'code:'+message.code + ', STATUS:'+message.status);

    this.transactionService.updateStatusTransaction(message);
  }

}
