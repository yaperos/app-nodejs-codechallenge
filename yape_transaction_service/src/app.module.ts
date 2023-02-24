import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [PrismaModule, TransactionsModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
