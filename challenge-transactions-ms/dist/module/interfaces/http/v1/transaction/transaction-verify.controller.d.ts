import { Logger } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { CreateTransactionVerifyDto } from './dto/create-transaction-verify.dto';
import { TransactionGenericApiResponse } from 'src/core/helpers/generic-response';
import { TransactionVerifyRequestDto } from './dto/transaction-verify-request.dto';
import { GetTransactionVerifyDto } from './dto/get-transaction-verify-by-id.dto';
export declare class TransactionVerifyController {
    private readonly logger;
    private readonly queryBus;
    private readonly commandBus;
    constructor(logger: Logger, queryBus: QueryBus, commandBus: CommandBus);
    getTransactionVerify(pathTransactionVerifyDto: GetTransactionVerifyDto): Promise<TransactionGenericApiResponse>;
    saveTransactionVerify(body: CreateTransactionVerifyDto): Promise<TransactionGenericApiResponse>;
    handleEventUpdateStatusTransactionVerify(transactionVerifyRequestDto: TransactionVerifyRequestDto): Promise<void>;
}
