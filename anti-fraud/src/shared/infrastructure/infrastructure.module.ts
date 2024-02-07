import { TransactionStatusProducerKafka } from 'src/validate/infra/transaction.status.producer';
import { BrokerModule } from './broker/broker.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  exports: [TransactionStatusProducerKafka],
  providers: [TransactionStatusProducerKafka],
  imports: [ConfigModule, HealthModule, BrokerModule],
})
export class InfrastructureModule {}
