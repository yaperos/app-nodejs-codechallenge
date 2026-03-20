import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiFraudeModule } from './antifraud/antifraud.module';

@Module({
  imports: [AntiFraudeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
