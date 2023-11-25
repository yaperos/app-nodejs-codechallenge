import { Module } from '@nestjs/common';
import { AntiFraudController } from './controllers/anti-fraud.controller';
import { AntiFraudService } from './services/anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from '../utils/kafka.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLUSTER',
        transport: Transport.KAFKA,
        options: kafkaConfig.options,
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
