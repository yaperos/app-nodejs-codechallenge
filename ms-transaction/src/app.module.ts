import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { TransactionController } from '@src/transaction.controller';
import { KafkaService } from '@src/core/services/kafka.services';
import { TransactionModel } from '@src/transaction.model';
import { TransactionServices } from '@src/transaction.services';

@Module({
  imports: [],
  controllers: [AppController, TransactionController],
  providers: [AppService, KafkaService, TransactionModel, TransactionServices],
})
export class AppModule {}
