import { IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class EnvironmentVariables {
  @IsString()
  BROKER_URL: string;
}

type IEnvironment = {
  streaming: {
    brokerUrl: string;
  };
};

const development: IEnvironment = {
  streaming: {
    brokerUrl: process.env.BROKER_URL,
  },
};

export const getConfiguration = () => {
  return {
    ...development,
  };
};

export function validateEnvironmentVariables(config: Record<string, unknown>) {
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
