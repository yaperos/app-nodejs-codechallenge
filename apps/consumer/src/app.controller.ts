import { Controller } from '@nestjs/common';
import { SubscribeTo } from './kafka/kafka.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor() {}

  @SubscribeTo('created_transaction')
  createdEvent(payload: string) {
    try {
      const _event = JSON.parse(payload);
      const { value } = _event.body;
      const appSrv = new AppService();
      const valid = appSrv.validateFraud(value);
      console.log('valid', valid);
      appSrv.sendEventStatus(valid, _event.body);
    } catch (error) {
      console.log('error', error);
    }
  }
}
