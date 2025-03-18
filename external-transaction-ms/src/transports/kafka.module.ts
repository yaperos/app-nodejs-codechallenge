import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, ANTI_FRAUD_SERVICE } from 'src/config';

const clientsModule: DynamicModule[] = [
  ClientsModule.register([
    {
      name: ANTI_FRAUD_SERVICE,
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'transaction-ms',
          brokers: envs.KAFKA_SERVERS,
        },
        consumer: {
          groupId: 'transaction-consumer',
        },
      },
    },
  ]),
];

@Module({
  imports: clientsModule,
  exports: clientsModule,
})
export class KafkaModule {}
