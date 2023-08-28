const express = require('express');
const ServerConfig = require('./src/config/ServerConfig');
const transactionRoutes = require('./src/routes');
const initializeKafka = require('./src/config/KafkaConfig');
const { initializeDB } = require('./src/config/DatabaseConfig');

const setUpApp = async () => {
  const app = express();

  await Promise.all([
    initializeKafka(),
    initializeDB(),
  ]);

  app.use(express.json());
  app.use('/api/transaction', transactionRoutes);

  return app;
};

if (require.main === module) {
  const startServer = async () => {
    const app = await setUpApp();
    const { port } = ServerConfig;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  };

  startServer();
}

module.exports = setUpApp;
