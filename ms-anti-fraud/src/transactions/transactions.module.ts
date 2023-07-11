import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { KafkaService } from '../kafka/kafka';

@Module({
  imports: [],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: KafkaService,
      useFactory: () => {
        return new KafkaService(
          'anti-fraud-client',
          'anti-fraud-consumer',
          ['localhost:9092'],
        );
      },
    }
  ]
})
export class TransactionsModule {}
