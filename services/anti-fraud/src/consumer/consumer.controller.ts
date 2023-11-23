import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { log } from 'console';

@Controller()
export class ConsumerController {
  @MessagePattern('transactions')
  async handleTransactions(@Payload() message) {
    log(`Received message: ${JSON.stringify(message)}`);
    let value: any;
    if (message.value < 1000) {
      log('Transaction approved');
      value = {
        ...message,
        approved: true,
      };
    } else {
      log('Transaction rejected');
      value = {
        ...message,
        approved: false,
      };
    }
    return { value };
  }
}
