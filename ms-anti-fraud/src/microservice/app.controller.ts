import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionMessage } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('anti_fraud')
  async validateTransaction(@Payload() message) {
    const { value, transactionExternalId } = message?.value;
    console.log('transactionExternalId', transactionExternalId);
    console.log(`message: ${JSON.stringify(message, null, 3)}`);
    const isValid = this.appService.validateValue(value);
    return { transactionExternalId, isValid };
  }
}
