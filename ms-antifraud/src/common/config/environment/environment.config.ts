import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataBaseConfig, KafkaConfig } from '../../interfaces';

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) { }

  get apiPort(): number {
    return this.configService.get<number>('API_PORT');
  }

  get environment(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get database(): DataBaseConfig {
    return {
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      name: this.configService.get<string>('DATABASE_NAME'),
    };
  }

  get transactionKafka(): KafkaConfig {
    return {
      host: `${this.configService.get<string>('TRANSACTION_KAFKA_HOST')}:${this.configService.get<number>('TRANSACTION_KAFKA_PORT')}`,
      name: this.configService.get<string>('TRANSACTION_KAFKA_NAME'),
      clientId: this.configService.get<string>('TRANSACTION_KAFKA_CLIENT_ID'),
      groupId: this.configService.get<string>('TRANSACTION_KAFKA_GROUP_ID'),
    };
  }

  get antifraudKafka(): KafkaConfig {
    return {
      host: `${this.configService.get<string>('ANTIFRAUD_KAFKA_HOST')}:${this.configService.get<number>('ANTIFRAUD_KAFKA_PORT')}`,
      name: this.configService.get<string>('ANTIFRAUD_KAFKA_NAME'),
      clientId: this.configService.get<string>('ANTIFRAUD_KAFKA_CLIENT_ID'),
      groupId: this.configService.get<string>('ANTIFRAUD_KAFKA_GROUP_ID'),
    };
  }
}