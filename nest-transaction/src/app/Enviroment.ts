import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const getEnvironmentVars = () => {
  Logger.log(`PORT: ${process.env.PORT}`);
  return {
    port: parseInt(process.env.PORT) || 4000,
  };
};

export const mongoEnvsFactory = async (config: ConfigService) => ({
  uri: config.get<string>('database.uri'),
});
