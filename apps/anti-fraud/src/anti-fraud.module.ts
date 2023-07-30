import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['kafka:29092'],
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
