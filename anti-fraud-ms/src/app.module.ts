import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AntiFraudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
