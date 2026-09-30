import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../../../application/commands/create-transaction/create-transaction.command';
import type { TransactionView } from '../../../application/dtos/transaction.view';
import { GetTransactionQuery } from '../../../application/queries/get-transaction/get-transaction.query';
import { IdempotencyInterceptor } from '../../interceptors/idempotency.interceptor';
import { CreateTransactionRequestDto } from '../dtos/create-transaction.request.dto';



@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @HttpCode(201)
    @UseInterceptors(IdempotencyInterceptor)
    create(@Body() dto: CreateTransactionRequestDto): Promise<TransactionView> {
        return this.commandBus.execute<CreateTransactionCommand, TransactionView>(
            new CreateTransactionCommand(
                dto.accountExternalIdDebit,
                dto.accountExternalIdCredit,
                dto.tranferTypeId,
                dto.value,
            ),
        );
    }

    @Get(':transactionExternalId')
    get(
        @Param('transactionExternalId', new ParseUUIDPipe()) transactionExternalId: string,
    ): Promise<TransactionView> {
        return this.queryBus.execute<GetTransactionQuery, TransactionView>(
            new GetTransactionQuery(transactionExternalId),
        );
    }
}