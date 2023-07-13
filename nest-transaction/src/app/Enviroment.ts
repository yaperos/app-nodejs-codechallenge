import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const getEnvironmentVars = () => {
  Logger.log(`PORT: ${process.env.PORT}`);
  return {
    port: Number(process.env.PORT) || 4000,
    database: {
      uri: String(process.env.MONGO_URI) || '',
    },
  };
};

export const mongoEnvsFactory = async (config: ConfigService) => ({
  uri: config.get<string>('database.uri'),
});
