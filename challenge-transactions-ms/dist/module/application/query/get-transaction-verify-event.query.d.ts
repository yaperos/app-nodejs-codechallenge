import { IQuery, IQueryHandler } from '@nestjs/cqrs';
import { TransactionVerifyRepository } from 'src/module/domain/repositories/transaction-verify.repository';
import { TransactionGenericApiResponse } from 'src/core/helpers/generic-response';
export declare class GetTransactionVerifyEventCommand implements IQuery {
    readonly transactionExternalId: string;
    constructor(transactionExternalId: string);
}
export declare class GetTransactionVerifyEventCommandHandler implements IQueryHandler<GetTransactionVerifyEventCommand, TransactionGenericApiResponse> {
    private readonly repository;
    constructor(repository: TransactionVerifyRepository);
    execute(command: GetTransactionVerifyEventCommand): Promise<TransactionGenericApiResponse>;
}
