import * as fs from 'fs';
import { parse } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { ErrMessage } from '../common/constants/error-messages.dictionary';
import { ConfigurationEnum } from './config.keys';
import { join } from 'path';
import * as process from 'process';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  public apiURL: string;

  constructor() {
    const isDevelopmentEnv = process.env.STATE !== 'production';

    if (isDevelopmentEnv) {
      const envFilePath = join(__dirname, '../..', '.env');
      const existsPath = fs.existsSync(envFilePath);

      if (!existsPath) {
        console.log(`.env ${ErrMessage[404]}`);
        process.exit(0);
      }

      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      this.envConfig = {
        ENV: process.env.STATE,

        APP_PORT: process.env.APP_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        BROKER_SERVER: process.env.BROKER_SERVER,
        BROKER_USERNAME: process.env.BROKER_USERNAME,
        BROKER_PASSWORD: process.env.BROKER_PASSWORD,
        BROKER_CONSUMER: process.env.BROKER_CONSUMER,
        TOPIC_MESSAGE: process.env.TOPIC_MESSAGE,
        TOPIC_RECEIPT: process.env.TOPIC_MESSAGE
      };
    }

    this.apiURL = this.get(ConfigurationEnum.API_URL);
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  // get templatesPath(): string {
  //   const templatesPath = join(__dirname, '/../../../public/templates');
  //   return templatesPath;
  // }
}
