import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTransactionUseCase } from "src/application/commands/create-transaction/create-transaction";
import { CreateTransactionResponse } from "src/application/dtos/create-transaction-response.dto";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @ApiResponse({
        status: 201,
        description: 'Transaction created successfully',
        type: CreateTransactionResponse,
    })
    @Post()
    async createTransaction(@Body() body:CreateTransactionDto){
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
}