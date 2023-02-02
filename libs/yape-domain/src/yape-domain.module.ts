import { Module } from '@nestjs/common';
import { YapeDomainService } from './yape-domain.service';

@Module({
  providers: [YapeDomainService],
  exports: [YapeDomainService],
})
export class YapeDomainModule {}
