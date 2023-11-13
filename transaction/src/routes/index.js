const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.post('/', transactionController.create);

router.get('/:id', transactionController.get);

router.get('/', transactionController.list);

module.exports = router;
