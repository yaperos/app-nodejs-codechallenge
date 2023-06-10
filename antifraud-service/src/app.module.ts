import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntifraudModule } from './core/antifraud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AntifraudModule,
  ],
})
export class AppModule {}
