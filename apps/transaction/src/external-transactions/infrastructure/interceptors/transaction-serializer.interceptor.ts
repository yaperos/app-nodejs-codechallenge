import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExternalTransaction } from '../../domain/external-transaction.entity';

@Injectable()
export class TransactionSerializerInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((externalTransaction: ExternalTransaction) =>
          externalTransaction.toPrimitives(),
        ),
      );
  }
}
