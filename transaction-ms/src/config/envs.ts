export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  password: process.env.DB_PASSWORD ?? '',
  name: process.env.DB_NAME ?? '',
  host: process.env.DB_HOST ?? '',
  dbPort: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? '',
  databaseUrl: process.env.DATABASE_URL ?? '',
});
