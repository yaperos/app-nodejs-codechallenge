import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudModule } from 'src/anti-fraud/anti-fraud.module';
import {
  getConfiguration,
  validateEnvironmentVariables,
} from 'src/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      validate: validateEnvironmentVariables,
    }),
    AntiFraudModule,
  ],
})
export class AppModule {}
