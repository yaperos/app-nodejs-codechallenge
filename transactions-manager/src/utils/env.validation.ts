import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

// This class represents the environment variables that the application needs
class EnvironmentVariables {
  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_DB: string;

  @IsNumber()
  PORT: number;
}

// This function validates the environment variables
export function validate(config: Record<string, unknown>) {
  // Converts the plain JavaScript object to an instance of EnvironmentVariables
  // It also enables implicit conversion, which means it will try to convert values to the appropriate types
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  // Validates the config object
  // If a property is missing, it will not skip it and will return an error instead
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  // If there are any validation errors, it throws an error
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  // If the validation is successful, it returns the validated config
  return validatedConfig;
}