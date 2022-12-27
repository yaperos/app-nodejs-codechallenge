import { plainToInstance } from 'class-transformer'
import { CorsOptions } from 'cors'
import { NextFunction, Request, Response } from 'express'
import { HttpErrorDto } from '../core/dtos/http-error.exception.dto'
import { EnvConfig } from '../utils/env-config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function httpErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err?.status ?? 500)
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
