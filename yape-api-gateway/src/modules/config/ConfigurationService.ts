import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('app.port');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('app.nodeEnv');
  }
  // kafka
  get kafkaHost(): string {
    return this.configService.get<string>('kafka.KAFKA_HOST');
  }

  get kafkaPort(): number {
    return this.configService.get<number>('kafka.KAFKA_PORT');
  }

  get kafkaGroupId(): string {
    return this.configService.get<string>('kafka.KAFKA_GROUP_ID');
  }

  get kafkaRequestTimeOut(): number {
    return this.configService.get<number>('kafka.KAFKA_REQUEST_TIME_OUT');
  }
}
