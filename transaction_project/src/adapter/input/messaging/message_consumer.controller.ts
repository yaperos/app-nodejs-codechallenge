import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MessagingService } from '../../input_output/messaging/messaging.service';

@Controller()
export class MessageConsumerController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly configService: ConfigService,
    private readonly messagingService: MessagingService,
  ) {}

  async onModuleInit() {
    Logger.log('MessageConsumerController::onModuleInit');

    const consumer = this.messagingService.getConsumer();
    await consumer.connect();

    // Consumers
    Logger.log('MessageConsumerController - consumers');
  }

  async onModuleDestroy() {
    this.messagingService.getConsumer().disconnect();
  }
}
