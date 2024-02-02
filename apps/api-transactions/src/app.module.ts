import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdaptersModule } from './infrastructure/adapters/adapters.module';
import config from '../../../config';
import { ApiTransactionModule } from '../src/core/application/api-transaction/api-transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config]
    }),
    AdaptersModule,
    ApiTransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
