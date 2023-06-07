import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor, NestMiddleware } from "@nestjs/common";
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class AppMiddleware implements NestInterceptor {
    private readonly timeoutMilliseconds: number;

    constructor() {
      this.timeoutMilliseconds = 1000;
    }
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(this.timeoutMilliseconds),
        catchError(err => {
          if (err instanceof TimeoutError) {
            return throwError({
              status: HttpStatus.REQUEST_TIMEOUT,
              message: 'The request has timed out',
            });
          }
          return throwError(err);
        }),
      );
    }
}