import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, validateSync } from 'class-validator';
import { logLevel } from 'kafkajs';

import { KafkaConfig } from './kafka.config';

export class KafkaAntiFraudConfig implements KafkaConfig {
  private readonly logger = new Logger(this.constructor.name);

  @IsNotEmpty({ each: true })
  readonly brokers = (<string>process.env.KAFKA_ANTIFRAUD_BROKERS)?.split(',');

  @IsNotEmpty()
  readonly groupId = <string>process.env.KAFKA_GROUP_ID;

  readonly logLevelConfig: logLevel =
    process.env.NODE_ENV !== 'test' ? logLevel.ERROR : logLevel.NOTHING;

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(
      `${this.constructor.name} validation error: ${JSON.stringify(error)}`,
    );
    process.exit(1);
  }
}

export const KAFKA_ANTIFRAUD_CONFIG_KEY = 'kafka_anti_fraud';

export const kafkaAntiFraudConfigFactory = registerAs(
  KAFKA_ANTIFRAUD_CONFIG_KEY,
  (): KafkaAntiFraudConfig => {
    return new KafkaAntiFraudConfig();
  },
);
