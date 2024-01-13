import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';

@Module({
  providers: [AntifraudService]
})
export class AntifraudModule {}
