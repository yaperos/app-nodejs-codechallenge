import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import expressConfig from '@config/express.config';
import { TransactionsModule } from '@modules/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [expressConfig],
    }),
    TransactionsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
