export interface ConfigType {
  port: number;
  environment: string;
  database: DataBaseConfig;
}

interface DataBaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  db: string;
}
