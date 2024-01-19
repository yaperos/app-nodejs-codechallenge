import { Module } from '@nestjs/common';

import { GraphqlModule } from './graphql/graphql.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [GraphqlModule, ServicesModule],
})
export class ConfigModule {}
