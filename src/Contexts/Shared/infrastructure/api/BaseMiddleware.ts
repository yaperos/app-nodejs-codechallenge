import { HttpRequest } from '../../domain/HttpRequest';
import { httpErrorMapper, HttpResponseError, httpResponseErrorAdapter } from '../../domain/HttpResponse';
import { NextFunction, Response } from 'express';

export abstract class BaseMiddleware {
  protected abstract handle(httpRequest: HttpRequest, response: Response, next: NextFunction): Promise<void>;

  public async execute(httpRequest: HttpRequest, response: Response, next: NextFunction): Promise<void> {
    try {
      await this.handle(httpRequest, response, next);
    } catch (error) {
      response.status(httpErrorMapper(error)).json(httpResponseErrorAdapter(error));
    }
  }

  protected success(next: NextFunction): void {
    next();
  }

  protected fail(response: Response, httpResponseError: HttpResponseError): void {
    response.status(httpResponseError.statusCode).json(httpResponseErrorAdapter(httpResponseError));
  }
}
