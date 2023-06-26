'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cargar archivos de rutas
var transaction_routes = require('./routes/transaction');

//rutas
app.use('/api', transaction_routes);

//exportar
module.exports = app;

