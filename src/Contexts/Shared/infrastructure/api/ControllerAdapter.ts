import { Response } from 'express';
import { BaseController } from './BaseController';
import { HttpRequest } from '../../domain/HttpRequest';

export class ControllerAdapter {
  static handle(controller: BaseController) {
    return async (request: HttpRequest, response: Response): Promise<void> => {
      const httpRequest = {
        ...request,
      };
      return await controller.execute(httpRequest, response);
    };
  }
}
