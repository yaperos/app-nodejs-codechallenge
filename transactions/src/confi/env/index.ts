import 'dotenv/config';

const env = {
  PORT: process.env.PORT || 3000,
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'localhost:9092',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: Number(process.env.DB_PORT || 5432),
    USERNAME: process.env.DB_USERNAME || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DATABASE: process.env.DB_DATABASE || 'postgres',
    SINCRONIZE: process.env.DB_SINCRONIZE !== 'false' || false,
  },
};

export default env;
