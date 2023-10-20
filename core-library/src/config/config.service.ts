import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { KafkaConstants } from '../common/constants/kafka.constant';

export type EnvConfig = Record<string, string>;

@Injectable()
export class ConfigService {

  private readonly KafkaEnvVarNames = [
    KafkaConstants.Fraud.REQUEST_TOPIC_ENV,
    KafkaConstants.Fraud.RESPONSE_TOPIC_ENV,
    KafkaConstants.Fraud.BROKER_ENV
  ]
  
  private readonly EnvVarsNames = [
    'NODE_ENV',
    'PORT'
  ];

  private readonly envConfig: EnvConfig;

  constructor() {
    const envVars: { [key: string]: string } = {};
    this.EnvVarsNames.push(...this.KafkaEnvVarNames)
    this.EnvVarsNames.forEach((name) => (envVars[name] = this.getEnvVar(name)));
    this.envConfig = this.validateInput(envVars);
  }

  private getEnvVar(name: string): string {
    return process.env[name];
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envValidations = {
      NODE_ENV: Joi.string().default('local').valid('local', 'development', 'test'),
      PORT: Joi.number().default(3000),
      [KafkaConstants.Fraud.REQUEST_TOPIC_ENV]: Joi.string().required(),
      [KafkaConstants.Fraud.RESPONSE_TOPIC_ENV]: Joi.string().required(),
      [KafkaConstants.Fraud.BROKER_ENV]: Joi.string().required()
    };

    const activeEnvValidations = this.EnvVarsNames.reduce((acc, cur) => ({ ...acc, [cur]: envValidations[cur] }), {});

    const envVarsSchema: Joi.ObjectSchema = Joi.object(activeEnvValidations);

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
    if (error) {

      throw new Error(error.message);
    }

    return validatedEnvConfig;
  }

  get env(): string {
    return String(this.envConfig.NODE_ENV);
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get(key: string, safe = false): string {
    const variable = this.getEnvVar(key);
    if (!variable && !safe) {
      throw new Error('Config variable does not exist: ' + key);
    }

    return variable;
  }
}