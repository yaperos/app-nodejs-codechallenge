import { Module } from '@nestjs/common';
import { Anti_fraudController } from './antifraud.controller';
import { Anti_fraudService } from './antifraud.service';

@Module({
  imports: [],
  controllers: [Anti_fraudController],
  providers: [Anti_fraudService],
})
export class Anti_fraudModule {}
