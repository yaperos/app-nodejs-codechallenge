import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
