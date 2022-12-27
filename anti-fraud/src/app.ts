import express, { Application, Request, Response } from 'express'

class App {
  private readonly expressApp: Application

  constructor() {
    this.expressApp = express()
    this.mountMiddlewares()
    this.mountRoutes()
  }

  mountMiddlewares() {
    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded({ extended: true }))
  }

  mountRoutes() {
    this.expressApp.get('/status', (req: Request, res: Response) => {
      res.json({ time: new Date() })
    })
    this.expressApp.use('*', (req: Request, res: Response) => {
      res.status(404).json({ message: 'Invalid path' })
    })
  }

  get app() {
    return this.expressApp
  }
}

export default new App().app
