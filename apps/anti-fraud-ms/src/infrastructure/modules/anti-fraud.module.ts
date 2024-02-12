import { Module } from '@nestjs/common';
import { AntiFraudController } from '../controllers/anti-fraud.controller';
import { AntiFraudService } from '../../domain/services/anti-fraud.service';

@Module({
  imports: [],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
