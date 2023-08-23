import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TransactionVerifyRepository } from 'src/module/domain/repositories/transaction-verify.repository';
import { TransactionVerifyRequest } from 'src/module/domain/entities/transaction-verify-request';
import { TransactionGenericApiResponse } from 'src/core/helpers/generic-response';
export declare class SaveTransactionVerifyEventCommand implements ICommand {
    readonly transactionVerifyRequest: TransactionVerifyRequest;
    constructor(transactionVerifyRequest: TransactionVerifyRequest);
}
export declare class SaveTransactionVerifyCommandHandler implements ICommandHandler<SaveTransactionVerifyEventCommand, TransactionGenericApiResponse> {
    private readonly repository;
    constructor(repository: TransactionVerifyRepository);
    execute(command: SaveTransactionVerifyEventCommand): Promise<TransactionGenericApiResponse>;
}
