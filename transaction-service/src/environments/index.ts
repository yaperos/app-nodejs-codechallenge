export const environment = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'frandev',
    database: process.env.DB_DATABASE || 'yape_transactions_db',
  },
};
