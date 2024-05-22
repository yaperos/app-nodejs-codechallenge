import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import enviromentConfig from '../config/enviroment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [enviromentConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
