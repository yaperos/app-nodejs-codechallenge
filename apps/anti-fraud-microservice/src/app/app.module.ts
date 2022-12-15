import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configurationYaml from '@nodejs-codechallenge/shared/config';
import { TransactionAmountValidator } from './transaction-amount-validator';
import { ApplicationProperties } from './config/application.properties';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurationYaml],
      isGlobal: true
   })
  ],
  controllers: [AppController],
  providers: [AppService, TransactionAmountValidator, ApplicationProperties],
})
export class AppModule {}
