import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  CLIENT_GATEWAY_PORT: number;
  KAFKA_BROKER: string;
}

const envSchema = joi
  .object({
    CLIENT_GATEWAY_PORT: joi.number().default(3000),
    KAFKA_BROKER: joi.string().default('localhost:9092'),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: Envs = value as Envs;
console.log({ envVars });
export const envs = {
  PORT: envVars.CLIENT_GATEWAY_PORT,
  KAFKA_BROKER: envVars.KAFKA_BROKER,
};
