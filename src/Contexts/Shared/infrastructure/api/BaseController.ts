import { httpErrorMapper, HttpResponseCodes, httpResponseErrorAdapter } from '../../domain/HttpResponse';
import { Response } from 'express';
import { HttpRequest } from '../../domain/HttpRequest';
import { ErrorReportingManager } from '../ErrorMonitoring/ErrorReportingManager';
import { HttpResponseMapper } from './HttpResponseMapper';
import { UseCaseResponse } from 'Contexts/Shared/domain/UseCaseResponse';

export abstract class BaseController {
  protected abstract handle(request: HttpRequest, response: Response): Promise<void>;

  public async execute(request: HttpRequest, response: Response): Promise<void> {
    try {
      await this.handle(request, response);
    } catch (error) {
      this.fail(response, error);
    }
  }

  protected ok<T extends UseCaseResponse>(response: Response, useCaseResponse: T) {
    response.status(HttpResponseCodes.success).json({
      success: true,
      ...HttpResponseMapper.run(useCaseResponse),
    });
  }

  protected created(response: Response) {
    response.status(HttpResponseCodes.created).json({
      success: true,
    });
  }

  protected notContent(response: Response) {
    response.status(HttpResponseCodes.noContent).json();
  }

  protected fail(response: Response, error: any) {
    const statusCode = httpErrorMapper(error);
    if (statusCode === HttpResponseCodes.internalServerError) {
      ErrorReportingManager.notify(error);
    }
    response.status(httpErrorMapper(error)).json(httpResponseErrorAdapter(error));
  }
}
