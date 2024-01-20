import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaController } from './kafka.controller';
import { kafkaConfig } from 'src/config/kafka.config';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: kafkaConfig,
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaService, TransactionsService],
  exports: [KafkaService],
  controllers: [KafkaController],
})
export class KafkaModule {}
