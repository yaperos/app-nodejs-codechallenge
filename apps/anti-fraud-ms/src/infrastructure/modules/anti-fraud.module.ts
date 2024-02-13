import { Module } from '@nestjs/common';
import { AntiFraudController } from '../controllers/anti-fraud.controller';
import { AntiFraudService } from '../../domain/services/anti-fraud.service';
import { KafkaModule } from '@app/common';
import { Token } from '../constants';

@Module({
  imports: [KafkaModule, KafkaModule.register(Token.TRANSACTION_CLIENT)],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
