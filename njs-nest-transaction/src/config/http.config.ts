import { varMsjApp } from './../enum';
import * as Joi from 'joi';

export class HttpConfig {
  private readonly options;
  private readonly envConfig: IEnvConfigInterface;

  constructor() {
    this.envConfig = this.validateInput(process.env);
    this.options =
    {
      timeout: parseInt(process.env.HTTP_TIMEOUT) || varMsjApp.APP_DEFAULT_HTTP_TIMEOUT,
      maxRedirects: parseInt(process.env.HTTP_MAX_REDIRECT) || varMsjApp.APP_DEFAULT_HTTP_MAX_REDIRECT
    };
  }

  public getOptions() {
    return this.options;
  }

  private validateInput(envConfig: IEnvConfigInterface): IEnvConfigInterface {
		const envVarsSchema: Joi.ObjectSchema = Joi.object({
			NODE_ENV: Joi.string().valid('development', 'qa', 'production').default('development'),
			PORT: Joi.number().default(3000),
		}).unknown(true);

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}

export default interface IEnvConfigInterface {
  [key: string]: string;
}
