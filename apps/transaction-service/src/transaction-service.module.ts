import { 
  Module,
  CacheModule,
} from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { 
  ConfigModule,
} from '@nestjs/config';
import { 
  ClientsModule,
   Transport 
} from '@nestjs/microservices';
import {
  TypeOrmModule
} from '@nestjs/typeorm';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';
import {
  dbConfig,
} from './config';
import {
  Transaction,
  TransactionType,
} from './db';
import {
  ANTIFRAUD_SERVICE,
  configOptions,
  ANTIFRAUD_ENGINE_CONSUMER,
} from '../../../@shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configOptions],
    }),
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([
      Transaction,
      TransactionType,
    ]),
    CacheModule.register<RedisClientOptions>({
      url: configOptions().redis.url,
    }),
    ClientsModule.register([
      {
        name: ANTIFRAUD_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud-engine-service',
            brokers: configOptions().kafka.brokers,
          },
          consumer: {
            groupId: ANTIFRAUD_ENGINE_CONSUMER,
          },
        },
      },
    ])
  ],
  exports: [],
  controllers: [ 
    TransactionServiceController,
  ],
  providers: [
    TransactionServiceService
  ],
})
export class TransactionServiceModule {}
