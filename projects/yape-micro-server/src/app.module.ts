import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
