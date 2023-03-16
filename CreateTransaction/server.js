const cors = require(`cors`)
const express = require(`express`)
const bodyParser = require(`body-parser`)

const responseHelper = require(`@api/helpers/Response`)
const routes = require(`@/start/routes`)

const app = express()

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(cors({
  origin: `*`,
  credentials: false
}))

// Cargamos las rutas
app.use(`/`, routes)

app.all(`*`, (req, res) => {
  res.status(404).send(responseHelper.responseNotFound())
})

module.exports = app
