import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfiguration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration],
    }),
    AntiFraudModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
