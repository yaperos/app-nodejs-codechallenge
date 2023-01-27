import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { MESSAGE_TRANSACTION_CREATED } from './commons/constanst';
import { MessageTransactionDto } from './dto/message-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(MESSAGE_TRANSACTION_CREATED)
  handleEventVerifyTransaction(@Payload() message: MessageTransactionDto) {
    this.appService.verifyTransaction(message);
  }
}
