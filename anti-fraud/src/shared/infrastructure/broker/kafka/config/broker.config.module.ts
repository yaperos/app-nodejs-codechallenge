import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import KafkaConfig from './broker.config';
import KafkaConfigSchema from './broker.config.schema';
import { KafkaConfigService } from './broker.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [KafkaConfig],
      validationSchema: KafkaConfigSchema,
      isGlobal: true,
    }),
  ],
  providers: [KafkaConfigService],
  exports: [KafkaConfigService],
})
export class KafkaConfigModule {}
