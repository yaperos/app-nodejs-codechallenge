/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud/anti-fraud.service';
import { KafkaModule } from './kafka/kafka.module';
import { FraudValidatorService } from './anti-fraud/fradu-validator.service';
import { ConfigModule } from '@nestjs/config';

import commonConfig from './configs/common.config';

@Module({
  imports: [KafkaModule, ConfigModule.forRoot({
    load: [commonConfig],
    isGlobal: true,
  })],
  controllers: [],
  providers: [AntiFraudService, FraudValidatorService],
})
export class AppModule {}
