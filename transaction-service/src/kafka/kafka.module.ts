import { Module, forwardRef } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { kafkaConfig } from 'src/config/kafka.config';
import { KafkaController } from './kafka.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';

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
    forwardRef(() => TransactionsModule),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
  controllers: [KafkaController],
})
export class KafkaModule {}
