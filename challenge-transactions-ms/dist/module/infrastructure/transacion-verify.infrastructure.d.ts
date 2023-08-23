import { Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionVerifyRepository } from '../domain/repositories/transaction-verify.repository';
import { TransactionVerifyRequest, TransactionVerifyUpdateRequest } from '../domain/entities/transaction-verify-request';
import { TransactionVerify } from '../domain/aggregates/transaction-verify';
import { TransactionVerifyEntity } from './entities/transaction-verify.entity';
import { Repository } from 'typeorm';
import { TransactionVerifyEmitterRequest } from '../domain/entities/transaction-validation-emitter-request';
import { Observable } from 'rxjs';
export declare class TransactionVerifyInfrastructure implements TransactionVerifyRepository {
    private readonly kafkaAuthClient;
    private readonly transactionVerifyRepository;
    private readonly logger;
    constructor(kafkaAuthClient: ClientKafka, transactionVerifyRepository: Repository<TransactionVerifyEntity>, logger: Logger);
    saveTransactionVerify(transactionVerifyRequest: TransactionVerifyRequest): Promise<TransactionVerify>;
    updateTransactionVerify(transactionVerifyUpdate: TransactionVerifyUpdateRequest): Promise<void>;
    emitterToValidateAntiFraud<T>(transactionVerify: TransactionVerifyEmitterRequest): Promise<Observable<T>>;
    findTransactionVerifyById(transactionExternalId: string): Promise<TransactionVerify>;
}
