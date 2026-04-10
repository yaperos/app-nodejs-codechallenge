import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentService } from './payments.service';
import { PaymentEntity } from './entities/payment.entity';
import { OutboxEventEntity } from './entities/outbox-event.entity';
import { PaymentProcessingStatusEntity } from './entities/payment-processing-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, OutboxEventEntity, PaymentProcessingStatusEntity])],
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}
