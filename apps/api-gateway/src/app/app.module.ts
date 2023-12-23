import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from '@app-nodejs-codechallenge/shared/env';
import { AntifraudModule } from './antifraud/antifraud.module';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
    }),
    AntifraudModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
