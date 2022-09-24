import { AntiFraud } from './anti-fraud.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { Outbox } from './outbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AntiFraud, Outbox])],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
