import { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { AntiFraudValidationRepository } from 'src/module/domain/repositories/anti-fraud-validation-repository';
import { Observable } from 'rxjs';
export declare class GetAntiFraudValidationEventCommand implements ICommand {
    readonly transactionExternalId: string;
    readonly value: number;
    constructor(transactionExternalId: string, value: number);
}
export declare class GetAntiFraudValidationEventCommandHandler implements ICommandHandler<GetAntiFraudValidationEventCommand> {
    private readonly repository;
    constructor(repository: AntiFraudValidationRepository);
    execute(command: GetAntiFraudValidationEventCommand): Promise<Observable<unknown>>;
}
