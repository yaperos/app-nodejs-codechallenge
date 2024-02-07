import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BROKER } from './kafka/config/broker.config';
import { KafkaConfigService } from './kafka/config/broker.config.service';
import { KafkaConfigModule } from './kafka/config/broker.config.module';
import { KafkaProducerService } from './kafka/producer.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: BROKER.SERVICE.toString(),
        inject: [KafkaConfigService],
        imports: [KafkaConfigModule],
        useFactory: async (config: KafkaConfigService) => ({
          name: config.name,
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: config.client_id,
              brokers: [`${config.host}:${config.port}`],
            },
            consumer: {
              groupId: config.consumer_group_id,
              heartbeatInterval: config.heartbeat_interval,
            },
          },
        }),
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class BrokerModule {}
