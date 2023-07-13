import { Logger } from '@nestjs/common';

export const getEnvironmentVars = () => {
  Logger.log(`PORT: ${process.env.PORT}`);
  Logger.log(`MONGO_URI: ${process.env.MONGO_URI}`);
  Logger.log(`KAFKA_HOST: ${process.env.KAFKA_HOST}`);
  Logger.log(`KAFKA_PORT: ${process.env.KAFKA_PORT}`);
  return {
    port: Number(process.env.PORT) || 4000,
    database: {
      uri: String(process.env.MONGO_URI) || '',
    },
    kafka: {
      host: String(process.env.KAFKA_HOST) || '',
      port: Number(process.env.KAFKA_PORT) || 9092,
    },
  };
};
