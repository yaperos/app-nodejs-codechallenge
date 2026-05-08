import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudService } from './anti-fraud.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
