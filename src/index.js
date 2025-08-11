require('dotenv').config();
const app = require('./app');
const { connectProducer } = require('./services/kafkaProducer');
const { startWorker } = require('./worker/consumerWorker');
const { run: runAntifraud } = require('./antifraud/mockAntifraud');

const PORT = process.env.PORT || 3000;

async function main() {
  // connect Kafka producer (will retry internally)
  try { await connectProducer(); } catch (e) { console.error('Kafka producer connect error', e); }
  // start consumer worker + antifraud mock
  startWorker().catch(e => console.error('worker failed', e));
  runAntifraud().catch(e => console.error('antifraud failed', e));
  // start HTTP
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

main().catch(e => { console.error(e); process.exit(1); });
