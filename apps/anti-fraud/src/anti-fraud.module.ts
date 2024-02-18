import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudController } from './controllers/anti-fraud.controller';
import { AntiFraudService } from './services/anti-fraud.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MOTIONS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'transaction_group'
          }
        }
      }
    ])
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService]
})

export class AntiFraudModule {}
