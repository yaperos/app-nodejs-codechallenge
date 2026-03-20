import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { AntiFraudService } from './antifraud.service';
import { KafkaConsumer } from '../kafka/kafka.consumer';

@Module({
  imports: [RedisModule],
  providers: [AntiFraudService, KafkaConsumer],
})
export class AntiFraudeModule {}
