import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BrokerLoggingInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = _context.switchToHttp().getRequest();
    const context = _context.getClass()?.name ?? BrokerLoggingInterceptor.name;
    this.logger.log(
      `<- Receiving a new message [${request?.topic}]: ${JSON.stringify(request?.value)}`,
      context,
    );
    return next.handle();
  }
}
