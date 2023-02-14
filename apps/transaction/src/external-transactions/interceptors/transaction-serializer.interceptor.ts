import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExternalTransactionDocument } from '../external-transaction.entity';

@Injectable()
export class TransactionSerializerInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((externalTransaction: ExternalTransactionDocument) => ({
        transactionExternalId: externalTransaction._id,
        transactionType: {
          name: externalTransaction.transactionType,
        },
        transactionStatus: {
          name: externalTransaction.status,
        },
        value: externalTransaction.value,
        createdAt: externalTransaction.createdAt,
      })),
    );
  }
}
