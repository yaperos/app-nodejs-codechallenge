import { Logger } from '@nestjs/common';

export const getEnvironmentVars = () => {
  Logger.log(`KAFKA_HOST: ${process.env.KAFKA_HOST}`);
  Logger.log(`KAFKA_PORT: ${process.env.KAFKA_PORT}`);
  return {
    kafka: {
      host: String(process.env.KAFKA_HOST) || '',
      port: Number(process.env.KAFKA_PORT) || 9092,
    },
  };
};
