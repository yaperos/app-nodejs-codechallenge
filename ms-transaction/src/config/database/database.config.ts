import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsInt, IsNotEmpty, validateSync } from 'class-validator';

export class DatabaseConfig {
  private readonly logger = new Logger(this.constructor.name);

  @IsNotEmpty()
  readonly host = <string>process.env.DB_HOST;

  @IsInt()
  readonly port = Number(process.env.DB_PORT);

  @IsNotEmpty()
  readonly username = <string>process.env.DB_USERNAME;

  @IsNotEmpty()
  readonly password = <string>process.env.DB_PASSWORD;

  @IsNotEmpty()
  readonly database = <string>process.env.DB_NAME;

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(
      `${this.constructor.name} validation error: ${JSON.stringify(error)}`,
    );
    process.exit(1);
  }
}

export const DATABASE_CONFIG_KEY = 'database';

export const databaseConfigFactory = registerAs(
  DATABASE_CONFIG_KEY,
  (): DatabaseConfig => {
    return new DatabaseConfig();
  },
);
