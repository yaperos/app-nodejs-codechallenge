import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  SERVER_PORT: string;

  @IsString()
  MONGO_DB_CONNECTION: string;

  @IsString()
  BROKER_URL: string;
}

type IEnvironment = {
  server: {
    port: string;
  };
  database: {
    mongodb: string;
  };
  streaming: {
    brokerUrl: string;
  };
};

const development: IEnvironment = {
  server: {
    port: process.env.SERVER_PORT,
  },
  database: {
    mongodb: process.env.MONGO_DB_CONNECTION,
  },
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
