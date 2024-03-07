// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/transactions', transactionController.createTransaction);
router.get('/transactions/:id', transactionController.getTransaction);
router.put('/transactions/:id/state', transactionController.updateTransactionState); // Nueva ruta para actualizar el estado

module.exports = router;
