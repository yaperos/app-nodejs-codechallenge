import { Module } from '@nestjs/common';
import { GearsService } from './gears.service';
import { GearsController } from './gears.controller';

@Module({
  controllers: [GearsController],
  providers: [GearsService]
})
export class GearsModule {}
