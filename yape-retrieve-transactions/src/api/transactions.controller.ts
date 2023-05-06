import { Controller, Get, Param, UsePipes, ValidationPipe } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { EventBusService } from "src/config/events/event-bus.service";
import { TransactionModel } from "src/transactions/models/transaction.model";
import { GetTransactionQuery } from "src/transactions/queries/get-transaction.query";
import { GetTransactionsQuery } from "src/transactions/queries/get-transactions.query";

@Controller({
    path: 'transactions',
    version: '1',
})
@ApiTags('Transactions')
export class TransactionsController { 
    constructor(private readonly queryBus: QueryBus, private eventBusService: EventBusService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las transacciones' })
    @ApiResponse({ status: 200, description: 'Respuesta correcta' })
    async getAll(): Promise<TransactionModel[]> {
        return await this.queryBus.execute(new GetTransactionsQuery());
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtiene la transacción por id' })
    @ApiResponse({ status: 200, description: 'Respuesta correcta' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getById(
        @Param() params: GetTransactionQuery,
    ): Promise<TransactionModel> {
        return await this.queryBus.execute(params);
    }

    @EventPattern('yape-transactions-created-topic')
    handleTransactionCreated(@Payload() message: any) {
        this.eventBusService.handle(message);
    }

    @EventPattern('yape-transactions-validate-topic')
    handleTransactionValidate(@Payload() message: any) {
        this.eventBusService.handle(message);
    }
}