import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_SERVICE', 
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction_service',
            brokers: ['kafka:29092'],
          },
        }
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
