import { Module } from '@nestjs/common';
import { 
  ClientsModule, 
  Transport,
} from '@nestjs/microservices';
import {
  TypeOrmModule
} from '@nestjs/typeorm';
import { 
  ConfigModule,
} from '@nestjs/config';
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
} from '../../../@shared';
import {
  configOptions,
  TRANSACTION_CONSUMER,
} from '../../../@shared';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([AntifraudFeature]),
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: configOptions().kafka.brokers,
          },
          consumer: {
            groupId: TRANSACTION_CONSUMER,
          },
        },
      },
    ])
  ],
  controllers: [AntifraudEngineServiceController],
  providers: [AntifraudEngineServiceService],
})
export class AntifraudEngineServiceModule {}
