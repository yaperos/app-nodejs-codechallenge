import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  KAFKA_BROKER: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
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
  PORT: envVars.PORT,
  KAFKA_BROKER: envVars.KAFKA_BROKER,
};
