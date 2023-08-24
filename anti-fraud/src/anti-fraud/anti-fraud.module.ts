import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-fraud',
            brokers: [process.env.KAFKA_HOST]
          },
          consumer: {
            groupId: 'transaction-consumer'
          }
        }
      }
    ])],
    providers: [AntiFraudService],
    controllers: [AntiFraudController]
  })
export class AntiFraudModule {}
