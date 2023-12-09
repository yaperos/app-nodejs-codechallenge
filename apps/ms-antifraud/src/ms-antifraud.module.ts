import { Module } from '@nestjs/common';
import { MsAntifraudController } from './ms-antifraud.controller';
import { MsAntifraudService } from './ms-antifraud.service';

@Module({
  imports: [],
  controllers: [MsAntifraudController],
  providers: [MsAntifraudService],
})
export class MsAntifraudModule {}
