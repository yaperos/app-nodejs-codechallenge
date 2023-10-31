import { transactionMessageManagerInstance } from './globals'
import { eventHandler } from './handlers/event.handler'
import expressAppServer from './server/server'
import { logger } from './shared/imports'

async function main (): Promise<void> {
  const { PORT } = process.env
  const port: string | number = PORT ?? 4001

  const appServer = expressAppServer

  const server = appServer.listen(port, () => {
    logger.logDebug(`Server running at port: ${port}`, 'Index.ts')
  })
  if (server.listening) {
    await transactionMessageManagerInstance.consume(eventHandler)
  }
}

void main()
