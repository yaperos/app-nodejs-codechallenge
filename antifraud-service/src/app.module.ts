import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/config.module';
import { AntifraudModule } from './antifraud/antifraud.module';

@Module({
  imports: [
    ConfigurationModule,
    AntifraudModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
