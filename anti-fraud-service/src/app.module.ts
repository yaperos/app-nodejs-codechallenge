import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { ValidateService } from './validate.service';

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
  providers: [ValidateService],
})
export class AppModule {}
