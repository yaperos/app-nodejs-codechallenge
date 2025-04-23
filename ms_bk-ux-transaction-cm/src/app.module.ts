import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { PrismaService } from './config/db-client';
import { TransactionRepository } from './repository/transaction.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionHandler } from './commands/handlers/create-transaction.handler';
import { EVENT_STORE } from './config/services';
import { UpdateTransactionStatusHandler } from './commands/handlers/update-transaction-status.handler';
import { EventStoreService } from './events/event-store';
import { envs } from './config/envs';
import { SeedService } from './db/seed.service';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ClientsModule.register([
      {
        name: EVENT_STORE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'ms-transaction-cm-consumer',
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
    PrismaService,
    TransactionRepository,
    CreateTransactionHandler,
    UpdateTransactionStatusHandler,
    EventStoreService,
    SeedService,
  ],
})
export class AppModule {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.onModuleInit();
  }
}
