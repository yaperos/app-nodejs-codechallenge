import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDTO } from './structure/dto/CreateTransactionDTO';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { EventPatternEvents } from 'src/constants/event-pattern-events';
import { UpdateTransactionDTO } from './structure/dto/UpdateTransactionDTO';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Guarda una transacción' })
  @ApiOkResponse({ type: CreateTransactionDTO })
  @Post()
  saveTransaction(@Body() transaction: CreateTransactionDTO) {
    return this.transactionService.create(transaction);
  }

  @ApiOperation({ summary: 'Obtiene todas las transacciones' })
  @ApiOkResponse({ type: [CreateTransactionDTO] })
  @Get()
  getAllTransactions() {
    return this.transactionService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene una transacciones' })
  @ApiOkResponse({ type: CreateTransactionDTO })
  @Get(':id')
  getTransaction(@Param('id') id: number) {
    return this.transactionService.findOneById(id);
  }

  @EventPattern(EventPatternEvents.UpdateTransaction)
  getTransactionUpdated(@Payload() payload: UpdateTransactionDTO) {
    return this.transactionService.getTransactionUpdated(payload);
  }
}
