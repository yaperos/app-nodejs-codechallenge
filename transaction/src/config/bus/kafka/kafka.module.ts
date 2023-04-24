import { Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from './kafka.service';
import { ConfigModule } from '../../env/config.module';
import {Partitioners} from "kafkajs";


@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const kafkaOptions: KafkaOptions = {
            options: {
              client: {
                clientId: await configService.get('KAFKA_CLIENT_ID'),
                brokers: (await configService.get('KAFKA_BROKERS')).split(','),
              },
              producer: {
                createPartitioner: Partitioners.DefaultPartitioner,
              },
            },
          };
          return {
            transport: Transport.KAFKA,
            ...kafkaOptions,
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
