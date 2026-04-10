import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusAggregatorService } from './status-aggregator.service';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { PaymentProcessingStatusEntity } from '../payments/entities/payment-processing-status.entity';
import { ConsumerProcessedEventEntity } from '../payments/entities/consumer-processed-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, PaymentProcessingStatusEntity, ConsumerProcessedEventEntity])],
  providers: [StatusAggregatorService],
})
export class AggregatorModule {}
