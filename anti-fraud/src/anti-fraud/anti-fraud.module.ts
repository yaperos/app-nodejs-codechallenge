import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.KAFKA,
        name: 'ANTI_FRAUD_SERVICE',
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
