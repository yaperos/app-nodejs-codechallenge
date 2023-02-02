import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ResponseFormat<T> {
  @ApiProperty()
  duration: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const url = `http://${request.headers.host}`;

    return next.handle().pipe(
      map((data) => {
        const selfLink = {
          rel: 'self',
          method: request.method,
          href: `${url}${request.path}`,
        };
        let customData = Array.isArray(data)? {...data, _links: []}: data;
        customData._links = (data._links === undefined || data._links.lenght == 0 ) ?  [selfLink] : data._links.splice(0,0,selfLink);

        return {
          duration: `${Date.now() - now}ms`,
          data: customData,
        }
      }),
    );
  }
}