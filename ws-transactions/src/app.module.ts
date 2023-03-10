import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsService } from './transactions/transactions.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [TransactionsModule],
  controllers: [AppController],
  providers: [PrismaService, TransactionsService, AppService],
})
export class AppModule {}

