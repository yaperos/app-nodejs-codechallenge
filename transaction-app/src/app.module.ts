import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'antifraud-consumer'
          }
        }
      }
    ]),
    PrismaModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
