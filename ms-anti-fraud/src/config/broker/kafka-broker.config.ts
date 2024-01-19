import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, validateSync } from 'class-validator';

export class KafkaBrokerConfig {
  private readonly logger = new Logger(this.constructor.name);

  @IsNotEmpty({ each: true })
  readonly brokers = (<string>process.env.KAFKA_BROKERS)?.split(',');

  @IsNotEmpty()
  readonly clientId = <string>process.env.KAFKA_CLIENT_ID;

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(
      `${this.constructor.name} validation error: ${JSON.stringify(error)}`,
    );
    process.exit(1);
  }
}

export const KAFKA_BROKER_CONFIG_KEY = 'kafka_broker';

export const kafkaBrokerConfigFactory = registerAs(
  KAFKA_BROKER_CONFIG_KEY,
  (): KafkaBrokerConfig => {
    return new KafkaBrokerConfig();
  },
);
