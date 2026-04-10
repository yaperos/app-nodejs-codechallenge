import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from './payments/payments.module';
import { RelayModule } from './relay/relay.module';
import { HealthModule } from './health/health.module';
import { ConsumersModule } from './consumers/consumers.module';
import { AggregatorModule } from './aggregator/aggregator.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentEntity } from './payments/entities/payment.entity';
import { OutboxEventEntity } from './payments/entities/outbox-event.entity';
import { PaymentProcessingStatusEntity } from './payments/entities/payment-processing-status.entity';
import { ConsumerProcessedEventEntity } from './payments/entities/consumer-processed-event.entity';
import { LedgerEntryEntity } from './payments/entities/ledger-entry.entity';
import { NotificationEntity } from './payments/entities/notification.entity';
import { KafkaModule } from './common/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          PaymentEntity,
          OutboxEventEntity,
          PaymentProcessingStatusEntity,
          ConsumerProcessedEventEntity,
          LedgerEntryEntity,
          NotificationEntity,
        ],
        synchronize: false,
      }),
    }),
    KafkaModule,
    PaymentsModule,
    RelayModule,
    ConsumersModule,
    AggregatorModule,
    NotificationsModule,
    HealthModule,
  ],
})
export class AppModule {}
