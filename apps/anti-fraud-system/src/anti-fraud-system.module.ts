import { Module } from '@nestjs/common';
import { AntiFraudSystemController } from './anti-fraud-system.controller';
import { AntiFraudSystemService } from './anti-fraud-system.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transactions',
            brokers: ['localhost:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          // consumer: {
          //   groupId: 'transactions-group',
          // },
        },
      },
    ]),
  ],
  controllers: [AntiFraudSystemController],
  providers: [AntiFraudSystemService],
})
export class AntiFraudSystemModule {}
