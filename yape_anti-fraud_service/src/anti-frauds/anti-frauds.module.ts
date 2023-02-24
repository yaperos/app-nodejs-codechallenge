import { Module } from '@nestjs/common';
import { AntiFraudsService } from './anti-frauds.service';
import { AntiFraudsController } from './anti-frauds.controller';

@Module({
  controllers: [AntiFraudsController],
  providers: [AntiFraudsService]
})
export class AntiFraudsModule {}
