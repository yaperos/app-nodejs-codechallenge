import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheAdminService } from './cache-admin.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CacheService, CacheAdminService],
  exports: [CacheService, CacheAdminService],
})
export class CacheModule {}
