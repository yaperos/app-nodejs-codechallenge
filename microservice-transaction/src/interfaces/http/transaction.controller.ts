import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTransactionUseCase } from "src/application/commands/create-transaction/create-transaction";
import { UpdateTransactionUseCase } from "src/application/commands/update-status-transaction/update-status-transaction";
import { CreateTransactionResponse } from "src/application/dtos/create-transaction-response.dto";
import { GetTransactionQuery } from "src/application/queries/get-transaction.query";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { GetTransactionDto } from "./dtos/get-transaction.dto";
import { UpdateTransactionDto } from "./dtos/update-transaction.dto";

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @ApiResponse({
        status: 201,
        description: 'Transaction created successfully',
        type: CreateTransactionResponse,
    })
    @Post()
    async createTransaction(@Body() body: CreateTransactionDto) {
        const {
            accountExternalIdDebit,
            accountExternalIdCredit,
            tranferTypeId,
            value,
        } = body;

        const command = new CreateTransactionUseCase(
            accountExternalIdDebit,
            accountExternalIdCredit,
            tranferTypeId,
            value,
        );

        return await this.commandBus.execute(command);
    }

    @MessagePattern('transaction.verified')
    async updateTransactionStatus(@Payload() message: any) {
        const {
            transactionExternalId,
            status,
        } = message;

        const command = new UpdateTransactionUseCase(
            transactionExternalId,
            status,
        );

        return await this.commandBus.execute(command);
    }

    @Get(':transactionExternalId')
    async getTransactionById(@Param() params: GetTransactionDto) {
        const { transactionExternalId } = params;
        return await this.queryBus.execute(new GetTransactionQuery(transactionExternalId));
    }

}