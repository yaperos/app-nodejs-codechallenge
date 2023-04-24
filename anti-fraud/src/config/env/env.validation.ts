import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { Environment } from '../constants/environment';

class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsEnum(Environment)
  APP_ENV: Environment;

}

/**
 * Method that validates environment variables upon initialization
 *
 * @param config object with the list of environment variables.
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
