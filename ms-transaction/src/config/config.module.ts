import { Module } from '@nestjs/common';

import { BrokerModule } from './broker/broker.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { MicroservicesModule } from './microservices/microservices.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    DatabaseModule,
    BrokerModule,
    CacheModule,
    MicroservicesModule,
    ServicesModule,
  ],
})
export class ConfigModule {}
