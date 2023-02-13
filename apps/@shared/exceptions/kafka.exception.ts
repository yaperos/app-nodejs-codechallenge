import {
    ArgumentsHost,
    Catch,
    Logger,
    RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
  
@Catch(RpcException)
export class KafkaExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(KafkaExceptionFilter.name);
  catch(exception: RpcException, _host: ArgumentsHost): Observable<never> {
    this.logger.warn(exception);
    return throwError(() => exception.getError());
  }
}