import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntifraudModule } from './antifraud/antifraud.module';

@Module({
  imports: [
    AntifraudModule
  ],
})
export class AppModule {}
