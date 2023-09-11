import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaEventBus } from './broker-even.bus';
import { KafkaProducerService } from './producer.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          name: 'yape-transactions-ms',
          transport: Transport.KAFKA,
          options: {
            subscribe: {
              fromBeginning: true
            },
            client: {
              clientId: 'yape-transactions-ms-client',
              brokers: [`${config.get<string>('kafka.host')}:${config.get<number>('kafka.port')}`]
            },
            consumer: {
              groupId: 'yape-transactions-ms-consumer',
              heartbeatInterval: 500
            }
          }
        })
      }
    ])
  ],
  providers: [KafkaProducerService, { provide: 'EventBus', useClass: KafkaEventBus }],
  exports: ['EventBus']
})
export class BrokerModule {}
