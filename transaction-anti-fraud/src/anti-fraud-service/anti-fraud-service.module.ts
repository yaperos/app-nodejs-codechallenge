import { Module } from '@nestjs/common';
import { AntiFraudServiceService } from './anti-fraud-service.service';
import { AntiFraudServiceController } from './anti-fraud-service.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [ClientsModule.register([
    {
      name: 'any_name_i_want',
      transport: Transport.KAFKA,
      options: {
        subscribe: {
          fromBeginning: true,
        },
        client: {
          clientId: 'transactions-validate-fraud',
          brokers: ['kafka:9092'],
        },
      },
    },
  ])],
  controllers: [AntiFraudServiceController],
  providers: [AntiFraudServiceService]
})
export class AntiFraudServiceModule {}
