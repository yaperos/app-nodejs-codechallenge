import { Module } from '@nestjs/common';
import { AntiFraudController } from './app.controller';
import { AntiFraudService } from './app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
