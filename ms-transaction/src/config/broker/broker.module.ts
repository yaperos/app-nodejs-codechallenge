import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_BROKER } from 'src/modules/shared/domain/providers/broker.provider';

import { kafkaBrokerConfigFactory } from './kafka-broker.config';
import { KafkaBrokerConfigProvider } from './kafka-broker-config.provider';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: KAFKA_BROKER,
          imports: [ConfigModule.forFeature(kafkaBrokerConfigFactory)],
          inject: [ConfigService],
          useClass: KafkaBrokerConfigProvider,
        },
      ],
      isGlobal: true,
    }),
  ],
})
export class BrokerModule {}
