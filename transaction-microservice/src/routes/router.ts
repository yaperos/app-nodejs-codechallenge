import { Elysia } from 'elysia'

import { router as healthRoutes } from './health.routes'
import { router as transactionRoutes } from './transaction.routes'


export const router = () => new Elysia()
    .use(healthRoutes())
    .use(transactionRoutes())
