const express = require('express');
const {createTransactionHandler,getTransactionByIdHandler} = require('./transaction.controller');

const router = express.Router();

router.post('/', createTransactionHandler);
router.get('/:id', getTransactionByIdHandler);

module.exports = router;
