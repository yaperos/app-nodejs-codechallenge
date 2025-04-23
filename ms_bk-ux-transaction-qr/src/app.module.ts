import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionRepository } from './repositories/transaction.repository';
import { PrismaService } from './config/db-client';
import { GetTransactionHandler } from './queries/handlers/get-transaction.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EVENT_STORE } from './config/services';
import { envs } from './config/envs';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ClientsModule.register([
      {
        name: EVENT_STORE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [envs.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'ms-transaction-events',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TransactionRepository,
    PrismaService,
    GetTransactionHandler,
  ],
})
export class AppModule {}
