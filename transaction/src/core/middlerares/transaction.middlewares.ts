import { plainToInstance } from 'class-transformer'
import { HttpError } from 'http-errors'
import { CorsOptions } from 'cors'
import { NextFunction, Request, Response } from 'express'
import { HttpErrorDto } from '../dtos/exceptions/http-error.exception.dto'
import { logger } from '../utils/logger'
import { EnvConfig } from '../utils/env-config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function httpErrorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  if (EnvConfig.environment !== 'development') {
    logger.error(err.message)
    logger.error(err.stack || '')
  }

  res.status(err.status ?? 500)
  res.json(plainToInstance(HttpErrorDto, err))
}

export const corsOptionsDelegate = function handler(
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void,
) {
  const corsOptions: { origin: boolean } = { origin: false }

  if (EnvConfig.whiteList.indexOf(req.header('Origin') ?? '') !== -1) {
    corsOptions.origin = true
  }

  callback(null, corsOptions)
}
