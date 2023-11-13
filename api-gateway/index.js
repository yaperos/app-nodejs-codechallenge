const createServer = require('./src/app');
require('dotenv').config()
const { run: runKafkaConsumer } = require('./src/services/kafkaConsumer');

const PORT = process.env.PORT || 4000;

createServer().then(app => {
  app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
    runKafkaConsumer();
  });
}).catch(error => {
  console.error('Error starting the server', error);
});
