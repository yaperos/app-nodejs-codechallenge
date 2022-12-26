import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { TransactionInfrastructure } from './module/infrastructure/transaction.infrastructure'
import { TransactionApplication } from './module/application/transaction.application'
import { TransactionController } from './module/infrastructure/interface/controller/transaction.controller'
import { TransactionRoute } from './module/infrastructure/interface/route/transaction.route'
import { corsOptionsDelegate, httpErrorHandler } from './core/middlerares/transaction.middlewares'
import { BrokerInfrastructure } from './module/infrastructure/broker.infrastructure'

class App {
  private readonly expressApp: Application

  constructor() {
    this.expressApp = express()
    this.mountMiddlewares()
    this.mountRoutes()
    this.setErrorHandler()
  }

  mountMiddlewares() {
    this.expressApp.use(cors())
    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded({ extended: true }))
    this.expressApp.use(cors(corsOptionsDelegate))
  }

  mountRoutes() {
    const infrastructure = new TransactionInfrastructure()
    const broker = new BrokerInfrastructure()
    const application = new TransactionApplication(infrastructure, broker)
    const controller = new TransactionController(application)
    const route = new TransactionRoute(controller)

    this.expressApp.get('/status', (req: Request, res: Response) => {
      res.json({ time: new Date() })
    })
    this.expressApp.use('/transaction', route.router)
    this.expressApp.use('*', (req: Request, res: Response) => {
      res.status(404).json({ message: 'Invalid path' })
    })
  }

  setErrorHandler() {
    this.expressApp.use(httpErrorHandler)
  }

  get app() {
    return this.expressApp
  }
}

export default new App().app
