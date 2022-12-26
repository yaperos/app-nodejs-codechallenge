import { BrokerBootstrap } from './bootstrap/broker.bootstrap'
import ServerBootstrap from './bootstrap/server.bootstrap'
import { logger } from './core/utils/logger'
import { AntiFraudApplication } from './module/application/anti-fraud.application'
import { BrokerInfrastructure } from './module/infrastructure/broker.infrastructure'
import BrokerController from './module/infrastructure/interface/broker/broker.controller'

const server = new ServerBootstrap()
const broker = new BrokerBootstrap()

const brokerInfrastructure = new BrokerInfrastructure()
const antifraudApplication = new AntiFraudApplication(brokerInfrastructure)

const brokerController = new BrokerController(antifraudApplication)

;(async () => {
  try {
    const listPromises = [server.initialize(), broker.initialize()]
    await Promise.all(listPromises)

    await brokerController.listen()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
})()
