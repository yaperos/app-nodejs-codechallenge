import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { NewTransactionMessage } from './dto/NewTransactionMessage';
import { KafkaExceptionFilter } from './kafkaException.filter';

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
