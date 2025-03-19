import { Module } from '@nestjs/common';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { AntiFraudMessageController } from './infrastructure/controllers/anti-fraud.message.controller';
import { ProcessTransactionUseCase } from './application/use-cases/process-transaction.usecase';

@Module({
  imports: [
    KafkaModule,
  ],
  controllers: [
    AntiFraudMessageController,
  ],
  providers: [
    ProcessTransactionUseCase,
  ],
})
export class AppModule {}
