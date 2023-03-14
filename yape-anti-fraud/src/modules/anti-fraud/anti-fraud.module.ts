import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule } from '@nestjs/microservices';
import { TransactionKafkaConfig } from '@core/config/kafka';

@Module({
  imports: [ClientsModule.register([TransactionKafkaConfig()])],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
