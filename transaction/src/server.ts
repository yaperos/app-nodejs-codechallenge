import ServerBootstrap from './bootstrap/server.bootstrap'
import { logger } from './core/utils/logger'
import { TransactionApplication } from './module/application/transaction.application'
import { TransactionInfrastructure } from './module/infrastructure/transaction.infrastructure'

const server = new ServerBootstrap()
// const broker = new BrokerBootstrap();

const paymentInfrastructure = new TransactionInfrastructure()
// const brokerInfrastructure = new BrokerInfrastructure()
const paymentApplication = new TransactionApplication(paymentInfrastructure) //, brokerInfrastructure)

// const brokerController = new BrokerController(paymentApplication)

;(async () => {
  try {
    const listPromises = [server.initialize()] //
    await Promise.all(listPromises)

    // await brokerController.listen()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
})()
