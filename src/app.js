const express = require('express');
const bodyParser = require('body-parser');
const transactionsRouter = require('./routes/transactions');

const app = express();
app.use(bodyParser.json());
app.use('/transactions', transactionsRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
