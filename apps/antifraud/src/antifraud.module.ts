import { Module } from '@nestjs/common';
import { AntifraudController } from './infraestructure/antifraud.controller';
import { AntifraudService } from './application/antifraud.service';

@Module({
  imports: [],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
