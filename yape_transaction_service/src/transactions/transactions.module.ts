import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProducerService } from 'src/kafka/producer.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, ProducerService],
  imports: [PrismaModule],
})
export class TransactionsModule {}
