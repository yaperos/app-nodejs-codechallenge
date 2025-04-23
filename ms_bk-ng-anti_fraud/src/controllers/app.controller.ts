import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction.events')
  onTransactionEvent(@Payload() data: any) {
    console.log('Transaction event received:', data);

    const { eventType, payload } = data;

    switch (eventType) {
      case 'transaction.created':
        this.appService.validateTransaction(payload);
        break;
    }
  }
}
