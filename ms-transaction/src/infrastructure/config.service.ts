import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    const fileEnvExist = fs.existsSync(filePath);
    if (!fileEnvExist) {
      this.envConfig = {
        PORT: process.env.PORT,
        BASE_URL: process.env.BASE_URL,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_USER: process.env.DATABASE_USER,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_PORT: process.env.DATABASE_PORT,
        DATABASE_SSL: process.env.DATABASE_SSL,
      };
    } else {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }
  }

  // get specific key in .env file
  get(key: string): string {
    return this.envConfig[key];
  }
}
