import { Controller, Logger } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaController {
  //constructor(private readonly kafkaService: KafkaService) {}
  @EventPattern('ANOTHER_TOPIC')
  async infoTransaction(@Payload() message: string): Promise<any> {
    Logger.log('MESSAGE_RECEIVED');
  }
}
