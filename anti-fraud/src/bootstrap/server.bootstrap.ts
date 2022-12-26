import http from 'http'
import { logger } from '../core/utils/logger'
import app from '../app'
import { EnvConfig } from '../core/utils/env-config'
import { Bootstrap } from './bootstrap'

export default class ServerBootstrap extends Bootstrap {
  initialize(): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      const { port } = EnvConfig
      const server = http.createServer(app)
      server
        .listen(port)
        .on('listening', () => {
          resolve(true)
          logger.info(`🚀 Server started on port ${port}`)
        })
        .on('error', (err) => {
          reject(err)
          logger.error('Server failed to start')
        })
    })
  }
}
