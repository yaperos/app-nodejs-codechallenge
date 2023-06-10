import { Controller, Get, Param } from '@nestjs/common';
import { CreateTransactionService } from '../application/create-transaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindTransactionService } from '../application/find-transaction.service';
import { EventHandlerInterface } from '../domain/service/event-handler.interface';
import { CreateTransactionEventDto } from '../domain/dtos/create-transaction-event.dto';
import { UpdateTransactionEventDto } from '../domain/dtos/update-transaction-event.dto';
import { UpdateTransactionService } from '../application/update-transaction.service';

@Controller('transaction')
export class TransactionController {
  private eventHandlerMap: Map<string, EventHandlerInterface>;

  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly updateTransactionService: UpdateTransactionService,
    private readonly findTransactionService: FindTransactionService,
  ) {
    this.eventHandlerMap = new Map<string, EventHandlerInterface>([
      ['create', createTransactionService],
      ['update', updateTransactionService],
    ]);
  }

  @MessagePattern('db-write-event-topic')
  async writeEvent(
    @Payload() payload: CreateTransactionEventDto | UpdateTransactionEventDto,
  ) {
    const eventHandler = this.eventHandlerMap.get(payload.type);
    await eventHandler.handle(payload);
  }

  @Get(':id')
  async findTransaction(@Param('id') id: string) {
    return this.findTransactionService.execute(id);
  }
}
