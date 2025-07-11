import { Module } from '@nestjs/common';
import { FraudDetectionMessageController } from './infrastructure/controllers/fraud-detection-message.controller';
import { KafkaModule } from './infrastructure/kafka/kafka-client.module';

import { ProcessFraudCheckUseCaseImpl } from './application/usecases/process-fraud-check.usecase.impl';

import { KafkaEventPublisher } from './infrastructure/adapters/kafka-event-publisher.adapter';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    KafkaModule,
  ],
  controllers: [FraudDetectionMessageController],
  providers: [
    {
      provide: 'ProcessFraudCheckUseCase',
      useClass: ProcessFraudCheckUseCaseImpl,
    },
    {
      provide: 'EventPublisher',
      useClass: KafkaEventPublisher,
    },
  ],
})
export class AppModule {}
