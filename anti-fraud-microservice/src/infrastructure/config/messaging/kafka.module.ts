import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigType } from '@nestjs/config';
import kafkaConfig from './kafka.config';
import { KafkaProducerService } from './kafka.producer';
import { KAFKA_CLIENT } from './kafka.tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        inject: [kafkaConfig.KEY],
        useFactory: (cfg: ConfigType<typeof kafkaConfig>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: cfg.clientId,
              brokers: cfg.brokers,
            },
            consumer: {
              groupId: cfg.groupId,
            },
          },
        }),
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [ClientsModule, KafkaProducerService],
})
export class KafkaInfraModule {}