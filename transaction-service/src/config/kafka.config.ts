import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig = (configService: ConfigService): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: [configService.get<string>('KAFKA_BROKER')],
      clientId: configService.get<string>('KAFKA_CLIENT_ID'),
    },
    consumer: {
      groupId: configService.get<string>('KAFKA_GROUP_ID'),
    },
  },
});
