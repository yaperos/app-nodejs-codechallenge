import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './infrastructure/config/configuration';
import { AntiFraudModule } from './infrastructure/modules/anti-fraud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        //
      }),
      envFilePath: './apps/anti-fraud-ms/.env',
      load: [configuration],
    }),
    AntiFraudModule,
  ],
})
export class MsModule {}
