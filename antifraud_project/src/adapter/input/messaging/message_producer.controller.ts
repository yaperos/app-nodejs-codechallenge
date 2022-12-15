import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller()
export class MessageProducerController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    console.log('MessageProducerController::onModuleInit');
    await this.kafkaService.getProducer().connect();
  }

  async onModuleDestroy() {
    this.kafkaService.getProducer().disconnect();
  }
}
