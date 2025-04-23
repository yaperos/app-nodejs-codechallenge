import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Response<T> {
  status: number;
  message: string;
  data: T | null;
}

@Injectable()
export class ResponseFormatInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return {
          status: statusCode,
          message: 'Success',
          data: data || null,
        };
      }),
      catchError((error) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'An unexpected error occurred';

        if (error.error) {
          statusCode = error.error.statusCode || statusCode;
          message = error.error.message || message;
        }

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          message = error.message;
        }

        const response = {
          statusCode: statusCode,
          message: message || 'An unexpected error occurred',
          data: null,
        };

        throw new RpcException(response);
      }),
    );
  }
}
