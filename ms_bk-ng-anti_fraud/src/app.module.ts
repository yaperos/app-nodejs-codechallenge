import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EVENT_STORE } from './config/services';
import { EventStoreService } from './events/event-store';
import { envs } from './config/envs';

@Module({
  imports: [
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
  providers: [AppService, EventStoreService],
})
export class AppModule {}
