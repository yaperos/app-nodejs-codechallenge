const express = require('express');
const cors = require('cors');

require('dotenv').config();
const path = require('path');

const { dbConnection } = require('./database/config.js');

const app = express();

app.use(cors());

app.use(express.json());

dbConnection();

app.use('/api/transaccion-financiera', require('./routes/core/transaccion-financiera.route'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});