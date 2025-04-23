import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TransactionRepository } from './repository/transaction.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionHandler } from './commands/handlers/create-transaction.handler';
import { EVENT_STORE } from './config/constants/services';
import { UpdateTransactionStatusHandler } from './commands/handlers/update-transaction-status.handler';
import { EventStore } from './events/event-store';
import { envs } from './config/envs';
import { SeedService } from './services/seed.service';
import { PrismaService } from './config/db/db-client';
import {
  EVENT_STORE_CLIENT_ID,
  EVENT_STORE_GROUP_ID,
} from './config/constants/event-store';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ClientsModule.register([
      {
        name: EVENT_STORE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: EVENT_STORE_CLIENT_ID,
            brokers: [envs.KAFKA_BROKER],
          },
          consumer: {
            groupId: EVENT_STORE_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    TransactionRepository,
    CreateTransactionHandler,
    UpdateTransactionStatusHandler,
    EventStore,
    SeedService,
  ],
})
export class AppModule {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.onModuleInit();
  }
}
