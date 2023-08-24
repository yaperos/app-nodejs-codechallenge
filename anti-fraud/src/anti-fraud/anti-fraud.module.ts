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
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'transaction-fraud-consumer'
          }
        }
      }
    ])],
    providers: [AntiFraudService],
    controllers: [AntiFraudController]
  })
export class AntiFraudModule {}
