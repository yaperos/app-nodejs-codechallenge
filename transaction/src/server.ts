import 'reflect-metadata'
import express, { Application, Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import { HttpError } from 'http-errors'
import { plainToClass } from 'class-transformer'
import { HttpErrorDto } from './core/dtos/exceptions/http-error.exception.dto'

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

function errorHandler(err: HttpError, req: Request, res: Response): void {
  if (ENVIRONMENT !== 'development') {
    // eslint-disable-next-line no-console
    console.error(err.message)
    // eslint-disable-next-line no-console
    console.error(err.stack || '')
  }

  res.status(err.status ?? 500)
  res.json(plainToClass(HttpErrorDto, err))
}

app.use(cors(corsOptionsDelegate))

// app.use(userRoute)
app.use(errorHandler)
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server running at port ${PORT}`)
})
