import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, timeout } from 'rxjs';
import { EnvironmentService } from '../config/environment';

@Injectable()
export class TimeOutInterceptor implements NestInterceptor {
  constructor(private readonly environmentService: EnvironmentService) {}
  intercept(
    context: ExecutionContext,
    nest: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return nest.handle().pipe(timeout(this.environmentService.timeout));
  }
}
