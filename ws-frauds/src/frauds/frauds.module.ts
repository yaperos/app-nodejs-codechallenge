import { Module } from '@nestjs/common';
import { FraudsService } from './frauds.service';
import { FraudsController } from './frauds.controller';

@Module({
  controllers: [FraudsController],
  providers: [FraudsService]
})
export class FraudsModule {}
