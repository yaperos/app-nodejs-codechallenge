import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'KAFKA_TRANSACTION',
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                // brokers: ['localhost:9092'],
                brokers: ['kafka:29092'],
              },
              consumer: {
                groupId: 'transaction-consumer',
              },
            },
          }),
        },
      ],
    }),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
