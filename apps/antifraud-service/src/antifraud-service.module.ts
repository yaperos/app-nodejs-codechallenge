import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AntifraudService } from './modules/antifraud/antifraud.service';
import { AntifraudController } from './modules/antifraud/antifraud.controller';

@Module({
  imports: [HttpModule],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
