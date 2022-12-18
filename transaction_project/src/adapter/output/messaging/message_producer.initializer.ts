import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessagingService } from '../../input_output/messaging/messaging.service';

@Controller()
export class MessageProducerInitializer
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly messagingService: MessagingService) {}

  async onModuleInit() {
    console.log('MessageProducerController::onModuleInit');
    await this.messagingService.getProducer().connect();
  }

  async onModuleDestroy() {
    this.messagingService.getProducer().disconnect();
  }
}
