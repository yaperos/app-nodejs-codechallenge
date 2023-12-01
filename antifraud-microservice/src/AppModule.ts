import { Module } from '@nestjs/common';
import { AntiFraudModule } from './modules/anti-fraud/AntiFraudeModule';
import { KafkaModule } from './modules/kafka/KafkaModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: false }),
    KafkaModule,
    AntiFraudModule,
  ],
})
export class AppModule {}
