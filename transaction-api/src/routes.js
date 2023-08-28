const express = require('express');
const { validateGetTransaction, validateNewTransaction } = require('./middleware/validations/transactionValidation');
const { createNewTransactionController, obtainTransactionInfoController } = require('./controllers/transactionController');

const router = express.Router();

router.post('/', validateNewTransaction, createNewTransactionController);

router.get('/:transactionId', validateGetTransaction, obtainTransactionInfoController);

module.exports = router;
