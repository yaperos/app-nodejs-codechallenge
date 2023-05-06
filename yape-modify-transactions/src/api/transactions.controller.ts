import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { EventBusService } from "src/config/events/event-bus.service";
import { CreateTransactionCommand } from "src/transactions/commands/create-transaction.command";
import { TransactionModel } from "src/transactions/models/transaction.model";

@Controller({
    path: 'transactions',
    version: '1',
})
@ApiTags('Transactions')
export class TransactionsController { 
    constructor(private readonly commandBus: CommandBus, private eventBusService: EventBusService) { }

    @Post()
    @ApiOperation({ summary: 'Crear una transacción.' })
    @ApiResponse({ status: 200, description: 'Respuesta correcta' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() transaction: CreateTransactionCommand): Promise<TransactionModel> {
        return await this.commandBus.execute(transaction);
    }

    @EventPattern('yape-transactions-validate-topic')
    handleTransactionValidate(@Payload() message: any) {
        this.eventBusService.handle(message);
    }
}