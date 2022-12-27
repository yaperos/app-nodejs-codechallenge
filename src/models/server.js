const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
// const kafka = require('kafka-node')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT

    this.paths = {
      // ej:
      tranasaction: '/api/transaction'
    }

    // Conectar a base de datos
    this.conectarDB()

    // Middlewares
    this.middlewares()

    // Rutas de mi aplicación
    this.routes()
  }

  async conectarDB () {
    // dbConnection();
    mongoose.connect(process.env.MONGO_CONNECT_URL)
  }

  middlewares () {
    // CORS
    this.app.use(cors())
    // Lectura y parseo del body
    this.app.use(express.json())
  }

  routes () {
    // ej:
    // this.app.use(
    // this.paths.route,
    // require("../apiServices/service/route"),
    // )
    this.app.use(
      this.paths.tranasaction,
      require('../apiServices/transaction/route')
    )
    this.app.get('/', (req, res) => {
      res.json('hola mundo')
    })
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puert0', this.port)
    })
  }
}

module.exports = Server
