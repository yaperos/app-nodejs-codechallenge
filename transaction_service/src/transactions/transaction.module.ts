import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { KafkaModule } from './../kafka/kafka.module';
import { TransactionConsumerController } from './controllers/transaction-consumer.controller';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    KafkaModule,
    CacheModule.registerAsync({
      isGlobal: true, // Make CacheManager available globally via @Inject(CACHE_MANAGER)
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: configService.get<number>('CACHE_TTL', 3600), // Default TTL in seconds (e.g., 1 hour)
        // Add other Redis options if needed (password, db index, etc.)
      }),
    }),
  ],
  controllers: [
    TransactionController,
    TransactionConsumerController
  ],
  providers: [
    TransactionService,
    TransactionResolver
  ],
  exports: [TransactionService],
})
export class TransactionModule { }