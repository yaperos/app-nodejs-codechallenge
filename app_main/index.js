const express = require('express');
const {query,body} = require('express-validator');
const {uuidv4} = require('./utils/utils');
const {createTransactionDTO} = require('./utils/transactionDTO');
const {consumeMessage, produceMessage} = require('./utils/kafka');
const {KAFKA_TOPIC_INSERT_TRANSACTION} = require('./utils/constants');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/transaction'
         ,body('accountExternalIdCredit').notEmpty()
         ,body('accountExternalIdDebit').notEmpty()
         ,body('tranferTypeId').isInt()
         ,body('value').isFloat()
         ,async (req, res) => {
           const accountExternalIdDebit = req.body.accountExternalIdDebit;
           const accountExternalIdCredit = req.body.accountExternalIdCredit;
           const tranferTypeId = parseInt(req.body.tranferTypeId);
           const value = parseFloat(req.body.value);
           const random_uuid = uuidv4();
           const trans = createTransactionDTO(random_uuid, tranferTypeId, 1, value, Date.now());
           await produceMessage(KAFKA_TOPIC_INSERT_TRANSACTION, trans);
           return res.status(200).send({code:0, msg: "Process initiated"});
         });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


// consumeMessage([KAFKA_TOPIC_ANTIFRAUD], (data)=> {
//   console.info(data);
  
// }).catch(console.error);
