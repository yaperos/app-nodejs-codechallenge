import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';

@Module({
  imports: [
    AntiFraudModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
