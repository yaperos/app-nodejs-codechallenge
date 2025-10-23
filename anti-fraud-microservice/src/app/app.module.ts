import { Module } from '@nestjs/common';
import { ReviewTransactionConsumer } from './messaging/review-transaction.consumer';
import { ConfigModule } from '@nestjs/config';
import kafkaConfig from '../infrastructure/config/messaging/kafka.config';
import { KafkaInfraModule } from '../infrastructure/config/messaging/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [kafkaConfig] }),
    KafkaInfraModule,
  ],
  controllers: [ReviewTransactionConsumer],
})
export class AppModule {}
