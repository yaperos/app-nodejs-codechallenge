const prisma = require('../db/prismaClient');
const { connectConsumer, subscribeTransactionStatus } = require('../services/kafkaConsumer');
async function startWorker() {
  await connectConsumer();
  await subscribeTransactionStatus(async ({ transactionExternalId, status }) => {
    if (!transactionExternalId || !status) return;
    try {
      await prisma.transaction.updateMany({ where: { transactionExternalId }, data: { status } });
      console.log('Updated', transactionExternalId, status);
    } catch (e) { console.error(e); }
  });
}
module.exports = { startWorker };
