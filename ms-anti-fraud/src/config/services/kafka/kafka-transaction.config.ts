import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, validateSync } from 'class-validator';
import { logLevel } from 'kafkajs';

import { KafkaConfig } from './kafka.config';

export class KafkaTransactionConfig implements KafkaConfig {
  private readonly logger = new Logger(this.constructor.name);

  @IsNotEmpty({ each: true })
  readonly brokers = (<string>process.env.KAFKA_TRANSACTION_BROKERS)?.split(
    ',',
  );

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

export const KAFKA_TRANSACTION_CONFIG_KEY = 'kafka_transaction';

export const kafkaTransactionConfigFactory = registerAs(
  KAFKA_TRANSACTION_CONFIG_KEY,
  (): KafkaTransactionConfig => {
    return new KafkaTransactionConfig();
  },
);
