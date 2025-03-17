import { Module } from '@nestjs/common';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './infrastructure/http/transaction.controller';
import { PrismaInfrastructure } from './infrastructure/database/prisma.infrastructure';
import { ProducerInfrastructure } from './infrastructure/stream/producer.infrastructure';
import { ConsumerInfrastructure } from './infrastructure/stream/consumer.infrastructure';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    PrismaInfrastructure,
    {
      provide: 'IProducer',
      useClass: ProducerInfrastructure,
    },
    {
      provide: 'IConsumer',
      useClass: ConsumerInfrastructure,
    },
  ],
})
export class AppModule {}
