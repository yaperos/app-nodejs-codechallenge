export interface ConfigType {
  portApi: number;
  environment: string;
  database: DataBaseConfig;
  kafka: {
    host: string;
  };
}

interface DataBaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  db: string;
}
