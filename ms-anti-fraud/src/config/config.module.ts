import { Module } from '@nestjs/common';

import { BrokerModule } from './broker/broker.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [BrokerModule, ServicesModule],
})
export class ConfigModule {}
