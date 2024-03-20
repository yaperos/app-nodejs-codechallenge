import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IEnvironmentConfig } from 'src/shared/utils/environment';

@Injectable()
export class EnvironmentConfigService implements IEnvironmentConfig {
  constructor(private configService: ConfigService) {}

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
  getAppName(): string {
    return this.configService.get<string>('APP_NAME');
  }
}
