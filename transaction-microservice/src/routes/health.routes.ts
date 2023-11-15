import { Elysia, t } from 'elysia'

import { checkHealth } from '../controllers/health.controller'


export const router = () => new Elysia()
    .get(
        '/api/health',
        () => {
            return checkHealth()
        },
        {
            response: t.Object({
                status: t.Boolean(),
                message: t.String(),
            })
        }
    )
