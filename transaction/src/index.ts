import { BrokerBootstrap } from './bootstrap/broker.bootstrap'
import ServerBootstrap from './bootstrap/server.bootstrap'
import { logger } from './core/utils/logger'
import { TransactionApplication } from './module/application/transaction.application'
import { BrokerInfrastructure } from './module/infrastructure/broker.infrastructure'
import BrokerController from './module/infrastructure/interface/broker/broker.controller'
import { RedisInfrastructure } from './module/infrastructure/redis.infrastructure'
import { TransactionInfrastructure } from './module/infrastructure/transaction.infrastructure'

const server = new ServerBootstrap()
const broker = new BrokerBootstrap()

const transactionInfrastructure = new TransactionInfrastructure()
const brokerInfrastructure = new BrokerInfrastructure()
const redisInfrastructure = new RedisInfrastructure()
const transactionApplication = new TransactionApplication(
  transactionInfrastructure,
  brokerInfrastructure,
  redisInfrastructure,
)

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
