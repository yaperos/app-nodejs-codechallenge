import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EXCEPTION_MAPPER } from '../constants/injection-tokens';
import { ExceptionHttpMapper } from '../services/exception-http-mapper';
import { CoreExceptionFilter } from '../filters/core-exception.filter';
import { TransformInterceptor } from '../interceptors/transform.interceptor';

export const exceptionMapper = {
  provide: EXCEPTION_MAPPER,
  useClass: ExceptionHttpMapper,
};
export const exceptionFilter = {
  provide: APP_FILTER,
  useClass: CoreExceptionFilter,
};

export const transformInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: TransformInterceptor,
};
