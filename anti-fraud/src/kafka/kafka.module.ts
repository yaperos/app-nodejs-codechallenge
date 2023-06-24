import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaService } from './services/kafka.service';
import { KafkaController } from './controllers/kafka.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-microservice',
            brokers: process.env.BROKER_SEED.split(' '),
            connectionTimeout: 30000,
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
