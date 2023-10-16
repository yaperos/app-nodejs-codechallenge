export default () => ({
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  configuration: {
    port: process.env.TRANSACTION_SERVICE_PORT,
  },
});
