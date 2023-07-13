import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { getEnvironmentVars, mongoEnvsFactory } from './app/Enviroment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVars],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoEnvsFactory,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
