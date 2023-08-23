import { Logger } from '@nestjs/common';
import { AntiFraudValidationRepository } from '../domain/repositories/anti-fraud-validation-repository';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionVerify } from '../domain/entities/transaction-verify';
import { Observable } from 'rxjs';
export declare class AntiFraudValidationInfrastructure implements AntiFraudValidationRepository {
    private readonly clientKafka;
    private readonly logger;
    constructor(clientKafka: ClientKafka, logger: Logger);
    getVerifyTransaction<T>(transaction: TransactionVerify): Promise<Observable<T>>;
}
