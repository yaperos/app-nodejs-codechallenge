import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { router } from './routes/router'
import { PORT } from './utils/constants.utils'
import { loggerPlugin } from './plugins/logger.plugin'
import { CustomErrorResponse } from './utils/errors.utils'


export const start = async () => {
    const app = new Elysia()
        .onError(({ error, set }) => {
            if (error instanceof CustomErrorResponse) {
                set.status = error.status
                return error.message
            }
        })
        .use(cors())
        .use(loggerPlugin())
        .use(router())
        .listen(PORT)

    if (Bun.env?.DISABLE_LOGS !== 'true') {
        console.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
    }

    return app
}
