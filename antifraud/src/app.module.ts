import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AntifraudController } from './antifraud/antifraud.controller';
import { AntifraudService } from './antifraud/antifraud.service';

@Module({
  imports: [ConfigModule],
  controllers: [AntifraudController],
  providers: [AntifraudService, ConfigService],
})
export class AppModule {}
