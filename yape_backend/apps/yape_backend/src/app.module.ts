import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { MessengerModule } from './messenger/messenger.module';

@Module({
  imports: [TransactionModule, MessengerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
