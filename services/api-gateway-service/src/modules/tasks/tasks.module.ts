import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get('redis.host');
        const port = configService.get('redis.port');

        return {
          isGlobal: true,
          store: redisStore,
          host,
          port,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
