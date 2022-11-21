import { NextFunction, Response } from 'express';
import { BaseMiddleware } from './BaseMiddleware';
import { HttpRequest } from '../../domain/HttpRequest';

export class MiddlewareAdapter {
  static handle(middleware: BaseMiddleware) {
    return async (httpRequest: HttpRequest, response: Response, next: NextFunction): Promise<void> => {
      await middleware.execute(httpRequest, response, next);
    };
  }
}
