import { Module } from '@nestjs/common';
import { 
  ClientsModule, 
  Transport,
} from '@nestjs/microservices';
import {
  TypeOrmModule
} from '@nestjs/typeorm';
import {
  dbConfig,
} from './config';
import {
  AntifraudFeature,
} from './db';
import { 
  AntifraudEngineServiceController,
} from './antifraud-engine-service.controller';
import { 
  AntifraudEngineServiceService,
} from './antifraud-engine-service.service';
import {
  TRANSACTION_SERVICE,
} from '../../@shared';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([AntifraudFeature]),
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: ['localhost:9091'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ])
  ],
  controllers: [AntifraudEngineServiceController],
  providers: [AntifraudEngineServiceService],
})
export class AntifraudEngineServiceModule {}
