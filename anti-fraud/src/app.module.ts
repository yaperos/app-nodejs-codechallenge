import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AntiFraudModule } from './modules/anti-fraud';

@Module({
  imports: [AntiFraudModule],
  controllers: [AppController]
})
export class AppModule {}
