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

  @MessagePattern(process.env.KAFKA_MESSAGE_PATTERN)
  @UseFilters(new KafkaExceptionFilter())
  @UsePipes(new ValidationPipe({ disableErrorMessages: false }))
  getNewTransaction(@Payload() message: NewTransactionMessage) {
    return {
      transactionExternalId: message.transactionExternalId,
      valid: this.appService.valueValidation(message.transactionValue),
    };
  }
}
