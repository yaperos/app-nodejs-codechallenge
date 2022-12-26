import { BrokerBootstrap } from './bootstrap/broker.bootstrap'
import ServerBootstrap from './bootstrap/server.bootstrap'
import { logger } from './core/utils/logger'
import { TransactionApplication } from './module/application/transaction.application'
import BrokerController from './module/infrastructure/interface/broker/broker.controller'
import { TransactionInfrastructure } from './module/infrastructure/transaction.infrastructure'

const server = new ServerBootstrap()
const broker = new BrokerBootstrap()

const transactionInfrastructure = new TransactionInfrastructure()
// const brokerInfrastructure = new BrokerInfrastructure()
const transactionApplication = new TransactionApplication(transactionInfrastructure) //, brokerInfrastructure)

const brokerController = new BrokerController(transactionApplication)

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
