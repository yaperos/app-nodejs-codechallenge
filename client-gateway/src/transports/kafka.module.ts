import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, TRANSACTION_SERVICE } from 'src/config';

const clientsModule: DynamicModule[] = [
  ClientsModule.register([
    {
      name: TRANSACTION_SERVICE,
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'client-gateway',
          brokers: envs.KAFKA_SERVERS,
        },
        consumer: {
          groupId: 'client-gateway-consumer',
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
