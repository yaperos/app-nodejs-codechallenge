import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyConsumerService } from './notify-consumer.service';
import { NotificationEntity } from '../payments/entities/notification.entity';
import { ConsumerProcessedEventEntity } from '../payments/entities/consumer-processed-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, ConsumerProcessedEventEntity])],
  providers: [NotifyConsumerService],
})
export class NotificationsModule {}
