import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreatedEvent } from './events/create.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction.created')
  async approved(@Payload() payload: CreatedEvent): Promise<void> {
    Logger.debug(payload);
    await this.appService.validateTransaction(payload);
  }
}
