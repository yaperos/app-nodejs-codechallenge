import { Module } from '@nestjs/common';
import { LoggerModule } from '@logger/logger.module';
import { AntifraudModule } from './modules/antifraud/antifraud.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AntifraudModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    LoggerModule.forRoot('Antifraud Module'),
  ],
  controllers: [],
  providers: [],
})
export class AntifraudServiceModule {}
