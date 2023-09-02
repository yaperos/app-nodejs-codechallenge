const express = require('express');
const { sequelize } = require('./models');

// Create express app
const app = express();

// MIDLEWARES
app.use(express.json()); // Transform req.body into JSON

// Mock request 
app.get('/ping', (_req, res) => {
    res.send('pong 🏓');
});

// Routes
const transactionRouter = require('./router/transactionRouter');
app.use('/transactions', transactionRouter);

// Start the server
app.listen(process.env.PORT || 8080, async () => {
    console.log(`App running on mode ${process.env.NODE_ENV} on port ${process.env.PORT}...`);
    await sequelize.authenticate();
    console.log('Database connected!');
});