import { Observable } from 'rxjs';
import { TransactionVerify } from '../aggregates/transaction-verify';
import {
  TransactionVerifyRequest,
  TransactionVerifyUpdateRequest,
} from '../entities/transaction-verify-request';
import { TransactionVerifyEmitterRequest } from '../entities/transaction-validation-emitter-request';

export interface TransactionVerifyRepository {
  saveTransactionVerify(
    transactionVerifyRequest: TransactionVerifyRequest,
  ): Promise<TransactionVerify>;
  updateTransactionVerify(
    transactionVerifyRequestDto: TransactionVerifyUpdateRequest,
  ): Promise<void>;
  emitterToValidateAntiFraud<T>(
    transactionVerify: TransactionVerifyEmitterRequest,
  ): Promise<Observable<T>>;
  findTransactionVerifyById(
    transactionExternalId: string,
  ): Promise<TransactionVerify>;
}
