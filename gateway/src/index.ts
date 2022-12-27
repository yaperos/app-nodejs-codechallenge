import ServerBootstrap from './bootstrap/server.bootstrap'
import { logger } from './utils/logger'
;(async () => {
  try {
    const serverBootstrap = new ServerBootstrap()
    await serverBootstrap.initialize()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
})()
