import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  NotFoundException, // Importa NotFoundException
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventBusService } from 'src/config/events/event-bus.service';
import { TransactionModel } from 'src/transactions/models/transaction.model';
import { GetTransactionQuery } from 'src/transactions/queries/get-transaction.query';

@Controller({
  path: 'transactions',
})
@ApiTags('Transactions')
export class TransactionsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBusService: EventBusService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getById(
    @Param() params: GetTransactionQuery,
  ): Promise<TransactionModel> {
    try {
      return await this.queryBus.execute(params);
    } catch (error) {
      throw new NotFoundException('Transaction not found'); // Usa NotFoundException para manejar el caso de no encontrar la transacción
    }
  }

  @EventPattern('queue-transactions-created-topic')
  handleTransactionCreated(@Payload() message: any) {
    this.eventBusService.handle(message);
  }

  @EventPattern('queue-transactions-validate-topic')
  handleTransactionValidate(@Payload() message: any) {
    this.eventBusService.handle(message);
  }
}
