import { Module } from '@nestjs/common';
import { FraudModule } from './fraud/fraud.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { KafkaModule } from './common/messaging/kafka.module';
import { AppLoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FraudModule,
    KafkaModule,
    AppLoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
