import { Module } from "@nestjs/common";
import { CachingService } from "./caching.service";
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from "cache-manager-redis-store";

@Module({
    imports: [CacheModule.register<any>({
        store: redisStore,
        host: "localhost",
        port: 8002
      })],
    providers: [CachingService],
    exports: [CachingService]
})
export class CachingModule {}