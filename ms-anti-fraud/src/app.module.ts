import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from 'src/modules/transaction/infrastructure/transaction.module';

import { AppController } from './app.controller';
import { ConfigModule as AppConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), AppConfigModule, TransactionModule],
  controllers: [AppController],
})
export class AppModule {}
