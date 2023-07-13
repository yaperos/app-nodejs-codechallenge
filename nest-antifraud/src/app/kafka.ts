import { ConfigService } from '@nestjs/config';
import {
  Transport,
  ClientsModule,
  ClientProvider,
} from '@nestjs/microservices';

export const KAFKA_TOPIC_NOTIFY_CREATE = 'topic-notify-create';

export const KAFKA_INSTANCE_NAME = 'my-kafka-instance';
export const KAFKA_CONSUMER_CLIENTID = 'antifraud-microservice-app';
export const KAFKA_CONSUMER_GROUP_ID = 'antifraud-microservice-group';

export const kafkaEnvsFactory = (config: ConfigService): ClientProvider => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: KAFKA_CONSUMER_CLIENTID,
      brokers: [
        `${config.get<string>('kafka.host')}:${config.get<number>(
          'kafka.port',
        )}`,
      ],
    },
    consumer: {
      groupId: KAFKA_CONSUMER_GROUP_ID,
    },
  },
});

export const CustomKafkaClientModule = ClientsModule.registerAsync([
  {
    name: KAFKA_INSTANCE_NAME,
    useFactory: kafkaEnvsFactory,
    inject: [ConfigService],
  },
]);
