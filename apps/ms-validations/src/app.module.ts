import { Module } from '@nestjs/common';

import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from './utils/kafka.config';

@Module({
  imports: [
    AntiFraudModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLUSTER',
        transport: Transport.KAFKA,
        options: kafkaConfig.options,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
