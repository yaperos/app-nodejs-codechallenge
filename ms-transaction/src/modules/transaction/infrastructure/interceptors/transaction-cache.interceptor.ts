import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { TransactionCacheService } from 'src/modules/transaction/domain/services/transaction-cache.service';

import { TransactionOutput } from '../../application/dtos/transaction.output';

@Injectable()
export class TransactionCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly transactionCacheService: TransactionCacheService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToRpc();
    const input = ctx.getData();

    if (input?.hasOwnProperty('id') && typeof input.id === 'string') {
      const transaction = await this.transactionCacheService.get(input.id);

      if (transaction) {
        return from([
          {
            code: HttpStatus.OK,
            data: TransactionOutput.fromTransaction(transaction),
          },
        ]);
      }
    }

    return next.handle();
  }
}
