const express = require('express');
const transactionRoutes = require('./transactions/transaction.routes');
const setupSwagger = require('./swagger');

const app = express();

app.use(express.json());
setupSwagger(app);

app.use('/transactions', transactionRoutes);

module.exports = app;