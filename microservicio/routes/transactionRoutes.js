// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/transactions', transactionController.createTransaction);
router.get('/transactions/:id', transactionController.getTransaction);

module.exports = router;
