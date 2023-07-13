import { Controller, Inject, Logger } from '@nestjs/common';
import { KAFKA_INSTANCE_NAME, KAFKA_TOPIC_NOTIFY_CREATE } from './app/kafka';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly client: ClientKafka,
  ) {}

  @MessagePattern(KAFKA_TOPIC_NOTIFY_CREATE)
  async infoTransaction(@Payload() message: any): Promise<any> {
    Logger.log('MESSAGE RECEIVED', message);
    return { response: 'FROM MICROSERVICE' };
  }
}
