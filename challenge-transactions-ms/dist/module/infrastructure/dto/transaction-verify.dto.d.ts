import { TransactionVerifyRequest } from 'src/module/domain/entities/transaction-verify-request';
import { TransactionVerifyEntity } from '../entities/transaction-verify.entity';
import { TransactionVerify } from 'src/module/domain/aggregates/transaction-verify';
export declare class TransactionVerifyDto {
    static fromDomainToEntity(transactionVerifyRequest: TransactionVerifyRequest): TransactionVerifyEntity;
    static fromDataToDomain(transactionVerifySaved: TransactionVerifyEntity): TransactionVerify;
}
