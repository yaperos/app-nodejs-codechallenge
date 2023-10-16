export default () => ({
  services: {
    transactionService: process.env.TRANSACTION_SERVICE_URL,
  },
  configuration: {
    port: process.env.API_SERVICE_PORT,
  },
});
