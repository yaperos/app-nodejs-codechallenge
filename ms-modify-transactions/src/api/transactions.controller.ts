import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventBusService } from 'src/config/events/event-bus.service';
import { CreateTransactionCommand } from 'src/transactions/commands/create-transaction.command';
import { TransactionModel } from 'src/transactions/models/transaction.model';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBusService: EventBusService,
  ) {}

  // Endpoint to create a transaction
  @Post()
  @ApiOperation({ summary: 'Create a transaction.' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() transaction: CreateTransactionCommand,
  ): Promise<TransactionModel> {
    // Execute the create transaction command using the command bus
    return await this.commandBus.execute(transaction);
  }

  // Event listener for 'queue-transactions-validate-topic'
  @EventPattern('queue-transactions-validate-topic')
  handleTransactionValidate(@Payload() message: any) {
    // Handle the transaction validation using the event bus service
    this.eventBusService.handle(message);
  }
}
