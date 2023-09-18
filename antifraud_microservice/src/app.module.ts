import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Database } from '../start/database';
import config from '../start/config';
// Controllers
import { AppController } from './app.controller';
import { AntifraudModule } from './antifrauds/modules/antifraud.module';
import { AntifraudController } from './antifrauds/controllers/antifraud.controller';
// Services
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
    }),
    Database,
    AntifraudModule,
  ],
  controllers: [AppController, AntifraudController],
  providers: [AppService, AntifraudModule],
})
export class AppModule {}
