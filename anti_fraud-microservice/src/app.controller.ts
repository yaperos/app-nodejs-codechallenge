import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  KafkaRetriableException,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { AppService } from './app.service';
import { NewTransactionMessage } from './dto/NewTransactionMessage';
import { KafkaExceptionFilter } from './KafkaExceptionFilter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('yape.new.transaction')
  @UsePipes(new ValidationPipe({ disableErrorMessages: false }))
  @UseFilters(new KafkaExceptionFilter())
  getNewTransaction(@Payload() message: NewTransactionMessage) {
    return {
      transactionExternalId: message.transactionExternalId,
      valid: this.appService.validateValue(message.transactionValue),
    };
  }
}
