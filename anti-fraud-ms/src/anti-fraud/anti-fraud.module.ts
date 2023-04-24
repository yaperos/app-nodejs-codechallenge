import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';

@Module({
    imports: [
        ClientsModule.register([
            {
              name: 'TRANSACTION_API_MS',
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: 'transaction',
                  brokers: ['kafka:9092'],
                },
                consumer: {
                  groupId: 'transaction-consumer'
                }
              }
            },
          ]),
    ],
    controllers: [
        AntiFraudController, 
    ],
    providers: [
        AntiFraudService, 
    ],
})
export class AntiFraudModule {}
