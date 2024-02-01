import { Module } from '@nestjs/common';
import { AdaptersService } from './adapters.service';
import { KafkaClientModule } from '@app/kafka-client'
import { ConfigModule } from '@nestjs/config';
import { ApiAntifraudModule } from '../../core/application/api-antifraud/api-antifraud.module';

@Module({
  imports: [
    ConfigModule,
    KafkaClientModule,
    ApiAntifraudModule,
  ],
  providers: [
    AdaptersService
  ],
  exports: [
    AdaptersService
  ],
})
export class AdaptersModule { }
