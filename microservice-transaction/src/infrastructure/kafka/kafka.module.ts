import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
    EnvironmentConfigModule,
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
