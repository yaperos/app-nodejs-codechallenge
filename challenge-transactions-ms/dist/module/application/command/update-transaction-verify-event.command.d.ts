import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TransactionVerifyRepository } from 'src/module/domain/repositories/transaction-verify.repository';
import { TransactionVerifyUpdateRequest } from 'src/module/domain/entities/transaction-verify-request';
export declare class UpdateTransactionVerifyEventCommand implements ICommand {
    readonly transactionVerifyRequest: TransactionVerifyUpdateRequest;
    constructor(transactionVerifyRequest: TransactionVerifyUpdateRequest);
}
export declare class UpdateTransactionVerifyEventCommandHandler implements ICommandHandler<UpdateTransactionVerifyEventCommand, void> {
    private readonly repository;
    constructor(repository: TransactionVerifyRepository);
    execute(command: UpdateTransactionVerifyEventCommand): Promise<void>;
}
