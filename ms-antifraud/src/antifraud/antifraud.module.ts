import { Module } from '@nestjs/common';
import { AntifraudKafkaModule } from 'src/common/config/kafka';
import { TransactionKafkaModule } from 'src/common/config/kafka/transaction/transaction.module';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';

@Module({
  imports: [
    AntifraudKafkaModule,
    TransactionKafkaModule,
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
