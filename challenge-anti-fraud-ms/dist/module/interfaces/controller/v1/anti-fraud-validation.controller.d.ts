import { Logger } from '@nestjs/common';
import { TransactionVerifyDto } from './dto/transaction-verify.dto';
import { CommandBus } from '@nestjs/cqrs';
export declare class AntiFraudValidationController {
    private readonly logger;
    private readonly commandBus;
    constructor(logger: Logger, commandBus: CommandBus);
    handleEventValidateTransaction(transactionVerify: TransactionVerifyDto): Promise<void>;
}
