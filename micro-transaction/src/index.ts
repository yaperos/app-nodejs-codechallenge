import { CONFIG } from './utils/environments';
import app from './App';
import { YAPE_TASK_CONSUMER } from './kafka/kafka.consumer';
import { RESOURCE_TRANSACTION } from './api/v1/transaction/transaction.interface';
import Transaction from './api/v1/transaction/transaction.model';

const host = '0.0.0.0';
const port = CONFIG.APP.PORT;
const env = CONFIG.APP.ENVIRONMENT;

app.listen(port, host, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('info', 'Environment: ' + env);
  console.log('info', `<${CONFIG.APP.NAME}> is listening on ${host}:${port}`);
});


YAPE_TASK_CONSUMER.on("message", async (message) => {
  if(message && message.value){
    try {
        let resourceTransaction: RESOURCE_TRANSACTION =  JSON.parse( message.value.toString() ) as RESOURCE_TRANSACTION;
        console.log( resourceTransaction );
        await Transaction.updateOne(
          {transactionExternalId: resourceTransaction.transactionExternalId},
          {$set: { transactionStatus: resourceTransaction.transactionStatus } }
        )

    } catch (error) {
        console.log("Resource is format invalidate")
    }
}
});

