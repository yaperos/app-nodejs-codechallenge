import { IDatabaseConfig } from '@/domain/config/database.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService implements IDatabaseConfig {
  constructor(private readonly configService: ConfigService) {}
  getKafkaHost(): string {
    return this.configService.get<string>('KAFKA_HOST');
  }
  getKafkaPort(): string {
    return this.configService.get<string>('KAFKA_PORT');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }
}
