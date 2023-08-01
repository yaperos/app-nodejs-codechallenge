import { Module } from '@nestjs/common';
import { kafkaAntiFraudProducerAdapters } from './providers/adapter.provider';
import { antiFraudDomainProvider } from './providers/domain.provider';

@Module({
  providers: [...kafkaAntiFraudProducerAdapters, ...antiFraudDomainProvider],
  exports: [...antiFraudDomainProvider],
})
export class AntiFraudModule {}
