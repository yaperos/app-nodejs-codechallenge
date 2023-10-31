import { type Request, type Response, type NextFunction } from 'express'
import { logger } from '../../shared/imports'

export default function httpRequestLoggerMiddleware (
  req: Request,
  _: Response,
  next: NextFunction): void {
  const { method, path, query, body } = req
  const methodUpperCase: string = method.toUpperCase()
  const queryParams = Object.keys(query).length > 0 ? `with QueryParams: ${JSON.stringify(query)}` : ''
  let message = `${methodUpperCase} - call to ${path} ${queryParams}`

  if (methodUpperCase === 'POST' || methodUpperCase === 'PUT') {
    message += ` with body ${JSON.stringify(body)}`
  }

  logger.logDebug(message, 'Server.ts')
  next()
}
