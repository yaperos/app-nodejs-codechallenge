import 'reflect-metadata'
import express, { Application, NextFunction, Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import { HttpError } from 'http-errors'
import { plainToInstance } from 'class-transformer'
import { HttpErrorDto } from './core/dtos/exceptions/http-error.exception.dto'
import transactionRoute from './module/infrastructure/interface/route/transaction.route'
import { logger } from './core/utils/logger'

const PORT = process.env.PORT || 3001
const ENVIRONMENT = process.env.NODE_ENV || 'development'

const app = <Application>express()
app.use(cors())
app.use(express.json())

const whiteList = ['*']
const corsOptionsDelegate = function handler(
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void,
) {
  const corsOptions: { origin: boolean } = { origin: false }

  if (whiteList.indexOf(req.header('Origin') ?? '') !== -1) {
    corsOptions.origin = true
  }

  callback(null, corsOptions)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function httpErrorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  if (ENVIRONMENT !== 'development') {
    logger.error(err.message)
    logger.error(err.stack || '')
  }

  res.status(err.status ?? 500)

  res.json(plainToInstance(HttpErrorDto, err))
}

app.use(cors(corsOptionsDelegate))

app.get('/status', (req: Request, res: Response) => {
  res.json({ time: new Date() })
})
app.use(transactionRoute)
app.get('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Invalid route' })
})
app.use(httpErrorHandler)

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
})
