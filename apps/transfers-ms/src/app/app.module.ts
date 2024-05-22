import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntifraudLibModule } from '@app-nodejs-codechallenge/antifraud-lib';
import { CoreLibModule } from '@app-nodejs-codechallenge/core-lib';

@Module({
  imports: [AntifraudLibModule, CoreLibModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
