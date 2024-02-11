import { Module } from '@nestjs/common';
import { AntiFraudMsController } from './controllers/anti-fraud-ms.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudMsService } from './services/anti-fraud-ms.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-ms',
            brokers: ['localhost:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          consumer: {
            groupId: 'transactions-ms',
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudMsController],
  providers: [AntiFraudMsService],
})
export class AntiFraudMsModule {}
