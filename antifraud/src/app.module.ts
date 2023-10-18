import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { LoggerModule } from './shared/logger/logger.module';
import { EventModule } from './shared/event/EventModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AntiFraudModule,
    LoggerModule,
    EventModule,
  ],
})
export class AppModule {}
