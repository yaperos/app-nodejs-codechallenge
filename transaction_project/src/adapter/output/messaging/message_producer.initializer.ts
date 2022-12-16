import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessagingService } from '../../input_output/messaging/mesaging.service';

@Controller()
export class MessageProducerInitializer
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly kafkaService: MessagingService) {}

  async onModuleInit() {
    console.log('MessageProducerController::onModuleInit');
    await this.kafkaService.getProducer().connect();
  }

  async onModuleDestroy() {
    this.kafkaService.getProducer().disconnect();
  }
}
