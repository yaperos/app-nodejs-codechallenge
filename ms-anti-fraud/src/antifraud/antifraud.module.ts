import { Module } from '@nestjs/common';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';
@Module({
  imports: [],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
