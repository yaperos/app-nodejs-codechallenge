import { KafkaModule } from '../kafka/KafkaModule';
import { AntiFraudController } from './AntiFraudController';
import { AntiFraudService } from './AntiFraudService';
import { Module } from '@nestjs/common';
import { CONSUMERS } from './events';

@Module({
  imports: [KafkaModule],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {
  constructor(private antiFraudService: AntiFraudService) {}

  async onModuleInit() {
    const requestPatterns = [CONSUMERS.TRANSACTION_CREATED];
    await this.antiFraudService.subscribeEvents(requestPatterns);
  }
}
