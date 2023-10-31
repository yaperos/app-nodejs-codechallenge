import express, { type Express, json, urlencoded, type Response } from 'express'
import cors from 'cors'
import { HTTP_CODES } from '../shared/imports'
import httpRequestLoggerMiddleware from './middlewares/httpRequestLogger.middleware'

const app: Express = express()

app.use(json({ limit: '10mb' }))
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(httpRequestLoggerMiddleware)

app.use((_, res: Response) => res.status(404).json({ status: 'not_found' }))
app.get('/api/health', (_, res: Response) => res.status(HTTP_CODES.OK).json({ status: 'ok' }))

export default app
