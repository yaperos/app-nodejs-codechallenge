import { Module } from '@nestjs/common';
import { ProducerInfrastructure } from './infrastructure/stream/producer.infrastructure';
import { AntiFraudService } from './application/anti-fraud.service';
import { ConsumerInfrastructure } from './infrastructure/stream/consumer.infrastructure';

@Module({
  imports: [],
  controllers: [],
  providers: [
    AntiFraudService,
    {
      provide: 'IProducer',
      useClass: ProducerInfrastructure,
    },
    {
      provide: 'IConsumer',
      useClass: ConsumerInfrastructure,
    },
  ],
})
export class AppModule {}
