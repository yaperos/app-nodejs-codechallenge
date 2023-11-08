import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaClient } from 'src/config/kafka.config';

@Module({
  imports: [ClientsModule.register(KafkaClient)],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
