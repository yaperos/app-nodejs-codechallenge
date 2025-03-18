import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  KAFKA_SERVERS: string[];
  MAX_VALUE_TRANSACTION: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),

    KAFKA_SERVERS: joi.array().items(joi.string()).required(),

    MAX_VALUE_TRANSACTION: joi.number().positive().required(),
  })
  .unknown();

const { error, value: envVars } = envSchema.validate({
  ...process.env,
  KAFKA_SERVERS: process.env.KAFKA_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs: EnvVars = envVars;
