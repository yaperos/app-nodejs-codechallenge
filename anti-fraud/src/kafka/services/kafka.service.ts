import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

@Injectable()
export class KafkaService {
  private kafkaProducer: Producer;

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.kafkaProducer = await this.kafkaClient.connect();
    await this.kafkaProducer.connect();
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    await this.kafkaProducer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
