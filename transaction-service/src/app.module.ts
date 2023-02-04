import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './application/transaction.module';
import { RedisModule } from './infraestructure/cache/redis.module';
import { DatabaseModule } from './infraestructure/database/database.module';
import { LoggerModule } from './infraestructure/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TransactionModule,
    LoggerModule,
    RedisModule,
  ],
  providers: [LoggerModule],
})
export class AppModule {}
