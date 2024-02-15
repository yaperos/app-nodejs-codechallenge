import { CacheService } from '@app/common/cache/cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

@Module({
  imports: [CacheModule.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheManagerModule {}
