import { Module } from '@nestjs/common';
import appConfig from './AppConfig';
import KafkaConfig from './KafkaConfig';

import { ConfigurationService } from './ConfigurationService';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, KafkaConfig],
    }),
  ],
  providers: [ConfigService, ConfigurationService],
  exports: [ConfigService, ConfigurationService],
})
export class ConfigurationModule {}
