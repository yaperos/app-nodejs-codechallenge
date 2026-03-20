import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/controller/transactions.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [PrismaModule, TransactionsModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
