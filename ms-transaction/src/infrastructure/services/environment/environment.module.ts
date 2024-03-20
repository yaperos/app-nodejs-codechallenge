import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '../../../shared/utils/env-path';
import { EnvironmentConfigService } from './environment.service';
import { validate } from './environment.validation';

const envFilePath: string = getEnvPath(`${process.cwd()}/.env`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      expandVariables: true,
      validate,
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
