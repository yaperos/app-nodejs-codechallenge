'use strict'

var express = require('express');
var TransactionController = require('../controllers/transactionController');

var router = express.Router();

router.post('/transactions', TransactionController.createTransaction);
router.post('/transactionsRetrieve', TransactionController.getAllTransaction);
router.put('/update/:transactionExternalId', TransactionController.updateTransaction);

module.exports = router;