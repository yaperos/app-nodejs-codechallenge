import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdaptersModule } from './infrastructure/adapters/adapters.module';
import config from '../../../config';
import { ApiAntifraudModule } from '../src/core/application/api-antifraud/api-antifraud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config]
    }),
    AdaptersModule,
    ApiAntifraudModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
