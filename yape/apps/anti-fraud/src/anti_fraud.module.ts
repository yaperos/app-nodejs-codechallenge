import { Module } from '@nestjs/common';
import { Anti_fraudController } from './anti_fraud.controller';
import { Anti_fraudService } from './anti_fraud.service';

@Module({
  imports: [],
  controllers: [Anti_fraudController],
  providers: [Anti_fraudService],
})
export class Anti_fraudModule {}
