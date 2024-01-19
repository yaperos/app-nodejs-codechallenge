import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

import {
  KAFKA_BROKER_CONFIG_KEY,
  KafkaBrokerConfig,
} from './kafka-broker.config';

@Injectable()
export class KafkaBrokerConfigProvider implements KafkaOptions {
  protected config: KafkaBrokerConfig;

  options: any;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<KafkaBrokerConfig>(
      KAFKA_BROKER_CONFIG_KEY,
    );

    this.options = {
      client: {
        clientId: this.config.clientId,
        brokers: this.config.brokers,
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
        allowAutoTopicCreation: true,
      },
      producerOnlyMode: true,
    };
  }

  createClientOptions(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: this.options,
    };
  }
}
