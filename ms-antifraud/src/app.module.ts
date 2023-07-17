import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntifraudModule } from './antifraud/antifraud.module';

@Module({
  imports: [AntifraudModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
