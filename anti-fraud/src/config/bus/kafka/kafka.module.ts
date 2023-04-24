import { Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from './kafka.service';
import { ConfigModule } from '../../env/config.module';


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
                clientId: await configService.get('ANTI_FRAUD_KAFKA_CLIENT_ID'),
                brokers: (await configService.get('KAFKA_BROKERS')).split(','),
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
