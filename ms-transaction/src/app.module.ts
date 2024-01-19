import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/modules/shared/infrastructure/shared.module';
import { TransactionModule } from 'src/modules/transaction/infrastructure/transaction.module';

import { ConfigModule as AppConfigModule } from './config/config.module';
import { AppController } from './modules/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppConfigModule,
    SharedModule,
    TransactionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
