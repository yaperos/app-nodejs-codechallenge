import { Transport, KafkaOptions } from '@nestjs/microservices';
import { CompressionTypes } from 'kafkajs';
import { KafkaConstants } from '../common/constants/kafka.constant';

export const microServiceKafka: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: KafkaConstants.General.CLIENT_ID,
      brokers: KafkaConstants.General.BROKERS
    },
    producer: {
      allowAutoTopicCreation: true
    },
    consumer: {
      groupId: KafkaConstants.General.CONSUMER_GROUP_ID
    },
    send: {
      compression: CompressionTypes.GZIP
    }
  }
};