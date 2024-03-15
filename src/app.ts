import 'dotenv/config'
import express, { Application } from 'express'
import Logger from '@/lib/log/logger'
import morganMiddleware from '@/lib/morgan/morgan-middleware'
import { router } from '@/routes/routes'
import cors from 'cors'
import { connect } from '@/lib/mongoose/mongoose-connect'

const app: Application = express()
const port = process.env.PORT
const url = process.env.APP_URL

app.use(cors())
app.disable('x-powered-by')
app.use(express.json())
app.use(morganMiddleware)
app.use(router)

connect()
  .then(() => Logger.info('Database connected'))
  .catch(Logger.error)

app.listen(port, () =>
  Logger.debug(`Server is up and running @ ${url}:${port}`)
)
