import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudModule } from './modules/anti-fraud/anti-fraud.module';

@Module({
  imports: [
    AntiFraudModule,
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    AntiFraudModule,
  ],
})
export class AppModule {}
