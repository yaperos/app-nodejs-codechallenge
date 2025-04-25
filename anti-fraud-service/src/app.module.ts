import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AntiFraudModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
