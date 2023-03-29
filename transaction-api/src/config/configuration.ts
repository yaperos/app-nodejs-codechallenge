import { ConfigType } from 'src/types/config.type';

export default (): ConfigType => ({
  portApi: parseInt(process.env.PORT) || 3000,
  environment: process.env.NODE_ENV,
  database: {
    port: parseInt(process.env.POSTGRESS_PORT),
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DATABASE,
  },
  kafka: {
    host: process.env.KAFKA_HOST,
  },
});
