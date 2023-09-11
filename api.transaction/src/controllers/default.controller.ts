import { Request, Response } from 'express';
import { route, GET } from 'awilix-express';

@route('/')
export default class DefaultController {
  @route('')
  @GET()
  index(req: Request, res: Response) {
    res.send('Application is running ..');
  }
}
