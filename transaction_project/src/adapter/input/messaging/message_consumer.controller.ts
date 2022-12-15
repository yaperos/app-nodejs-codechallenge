import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';

// TODO: a consumer will be used soon. For now we used it to initialize the producer;
@Controller()
export class MessageConsumerController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    console.log('MessageConsumerController::onModuleInit');

    // Producer
    console.log('MessageConsumerController::onModuleInit - producer');
    await this.kafkaService.getProducer().connect();
  }

  async onModuleDestroy() {
    this.kafkaService.getProducer().disconnect();
  }
}
