import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fraud-detection',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
