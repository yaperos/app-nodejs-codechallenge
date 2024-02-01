import { Module } from '@nestjs/common';
import { ApiAntifraudService } from './api-antifraud.service';
import { AdaptersModule } from '../../../infrastructure/adapters/adapters.module';
import { KafkaClientModule } from '@app/kafka-client';

@Module({
  imports: [
    KafkaClientModule,
  ],
  providers: [
    ApiAntifraudService
  ],
  exports: [
    ApiAntifraudService
  ]
})
export class ApiAntifraudModule {}
