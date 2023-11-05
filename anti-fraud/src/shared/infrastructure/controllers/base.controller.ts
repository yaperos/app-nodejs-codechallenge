import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from '../../infrastructure/exceptions/http.exception.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { FormatResponseInterceptor } from '../interceptors/format-response.interceptor';

@UseInterceptors(FormatResponseInterceptor)
@UseFilters(HttpExceptionFilter) // Use http exceptions filters
@UseInterceptors(LoggingInterceptor) // Use logging interceptor
@Controller()
export class BaseController {}
