import { 
  Module,
  CacheModule,
} from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
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
  dbConfig
} from './config';
import {
  Transaction,
  TransactionType,
} from './db';
import {
  ANTIFRAUD_SERVICE,
} from '../../@shared';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([
      Transaction,
      TransactionType,
    ]),
    CacheModule.register<RedisClientOptions>({
      //store: redisStore,
      url: 'redis://localhost:6379',
      //host: 'localhost',
      //port: 6379,
    }),
    ClientsModule.register([
      {
        name: ANTIFRAUD_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud-engine-service',
            brokers: ['localhost:9091'],
          },
          consumer: {
            groupId: 'antifraud-engine-consumer',
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
