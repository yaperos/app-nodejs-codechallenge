/* Extra */
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

interface IEnvironment {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_MAX_CONNECTIONS: number;
  DB_MIN_CONNECTIONS: number;
  KAFKA_TRANSACTIONS_TOPIC: string;
  KAFKA_TRANSACTIONS_VALIDATED_TOPIC: string;
  KAFKA_TRANSACTIONS_CONSUMER_GROUP: string;
}

class EnvironmentVariables implements IEnvironment {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  HOST: string;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_NAME: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsNumber()
  DB_MAX_CONNECTIONS: number;

  @IsNumber()
  DB_MIN_CONNECTIONS: number;

  @IsNotEmpty()
  @IsString()
  KAFKA_URL: string;

  @IsNotEmpty()
  @IsString()
  KAFKA_TRANSACTIONS_TOPIC: string;

  @IsNotEmpty()
  @IsString()
  KAFKA_TRANSACTIONS_VALIDATED_TOPIC: string;

  @IsNotEmpty()
  @IsString()
  KAFKA_TRANSACTIONS_CONSUMER_GROUP: string;
}

export function EnvValidation(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
