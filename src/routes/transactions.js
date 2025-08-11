const express = require('express');
const router = express.Router();
const { createTransaction, getTransaction } = require('../controllers/transactionController');

router.post('/', createTransaction);
router.get('/:transactionExternalId', getTransaction);

module.exports = router;
