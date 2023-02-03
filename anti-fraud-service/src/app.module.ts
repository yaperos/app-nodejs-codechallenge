import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './application/app.controller';
import { AntiFraudService } from './domain/anti-fraud.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'YAPE_EVENT_BUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
          // consumer: {
          //   groupId: 'transactionn-consumer',
          // },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AntiFraudService],
})
export class AppModule {}
