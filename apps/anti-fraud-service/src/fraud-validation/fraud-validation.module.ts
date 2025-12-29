import { Module } from '@nestjs/common';
import { FraudValidationService } from './fraud-validation.service';
import { FraudValidationConsumer } from './fraud-validation.consumer';

@Module({
  providers: [FraudValidationService, FraudValidationConsumer],
  exports: [FraudValidationService],
})
export class FraudValidationModule {}
