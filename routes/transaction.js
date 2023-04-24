const { save, updateStatus, getByTransactionExternalId } = require("../controller/transaction");
const express = require('express');
const router = express.Router();



router.post('/', save);
router.post('/update-status', updateStatus);
router.get('/:transactionExternalId', getByTransactionExternalId);

module.exports = router;