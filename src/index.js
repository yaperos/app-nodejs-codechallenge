require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./handler/dbHandler');
const routes = require('./routes/transactionRoutes');
const { validateTransaction } = require('./service/transactionService');
const schedule = require('node-schedule');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT;

dbConnect();

app.listen(PORT, () => { console.log(`Server listen in port ${PORT}`) });

schedule.scheduleJob('15 * * * * *', validateTransaction);