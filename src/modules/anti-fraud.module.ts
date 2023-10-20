import { Logger, Module } from '@nestjs/common';
import { KafkaSender } from 'core-library/src/sender/kafka.sender';
import { MessageValidatorService } from 'anti-fraud/src/core/message-validator.service';
import { FraudKafkaListener } from 'anti-fraud/src/listener/validator.listener';



@Module({
  imports: [],
  controllers: [FraudKafkaListener],
  providers: [MessageValidatorService, KafkaSender, FraudKafkaListener, Logger],
  exports: [MessageValidatorService, KafkaSender, FraudKafkaListener]
})
export class AntiFraudModule {}
