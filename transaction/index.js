'use strict'

//Conexión BD
var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/financial')
    .then(() => {
        console.log("Conexión a la BD establecida con éxito!");

        //Creación del servidor
        app.listen(port, () => {
            console.log(`Servicio Transacciones Ejecutado-> http://localhost:${port}`);
        });

    })
    .catch(err => console.log(err));