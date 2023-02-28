import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('created_transaction')
  validateTransaction(@Payload() message: KafkaMessage) {
    console.log(
      `created_transaction: ${JSON.stringify(message.value, null, 3)}`,
    );
    this.appService.validateValue(message.value);
  }
}
