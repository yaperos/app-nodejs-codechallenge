import http from 'http'
import app from '../app'
import { EnvConfig } from '../core/utils/env-config'
import { logger } from '../core/utils/logger'
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
          logger.info(`Server started in port ${port}`)
        })
        .on('error', (err) => {
          reject(err)
          logger.error('Server failed to start')
        })
    })
  }
}
