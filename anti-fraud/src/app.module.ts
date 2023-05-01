import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';

@Module({
  imports: [AntiFraudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
