import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { instanceToPlain } from 'class-transformer';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { TransactionApprovedEvent } from '../anti-fraud/events/TransactionApprovedEvent';
import { TransactionRejectedEvent } from '../anti-fraud/events/TransactionRejectedEvent';
import { LoggerService } from '../shared/logger/logger.service';
import { Producer } from '../shared/event/Producer';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private eventBus: Producer,
    private readonly logger: LoggerService,
  ) {}

  @EventPattern('transactionApproved')
  async transactionApproved(@Payload() message: TransactionApprovedEvent) {
    try {
      await this.transactionService.updateStatusTransaction(
        message.data.id_transaction,
        2,
      );
      this.logger.log({
        function: 'transactionApproved',
        layer: 'transaction.controller',
        msg:
          'Se confirma aprobacion de tansaccion ' + message.data.id_transaction,
      });
    } catch (e) {
      this.logger.error({
        function: 'transactionApproved',
        layer: 'transaction.controller',
        msg:
          'Ocurrio error al confirmar aprobacion de tansaccion ' +
          message.data.id_transaction,
        e,
      });
      throw e;
    }
  }

  @EventPattern('transactionRejected')
  async transactionRejected(@Payload() message: TransactionRejectedEvent) {
    try {
      await this.transactionService.updateStatusTransaction(
        message.data.id_transaction,
        3,
      );
      this.logger.log({
        function: 'transactionRejected',
        layer: 'transaction.controller',
        msg: 'Se confirma rechazo de tansaccion ' + message.data.id_transaction,
      });
    } catch (e) {
      this.logger.error({
        function: 'transactionRejected',
        layer: 'transaction.controller',
        msg:
          'Ocurrio un error al confirma rechazo de tansaccion ' +
          message.data.id_transaction,
        e,
      });
      throw e;
    }
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      const trans = await this.transactionService.create(createTransactionDto);
      const event = new TransactionCreatedEvent(trans);
      await this.eventBus.emit(event);
      this.logger.log({
        function: 'create',
        layer: 'transaction.controller',
        msg: 'Se crea nueva  tansaccion ' + trans.id_transaction,
        transaction: trans,
      });
      return instanceToPlain(new GetTransactionDto(trans), {
        excludeExtraneousValues: true,
      });
    } catch (e) {
      this.logger.log({
        function: 'create',
        layer: 'transaction.controller',
        msg:
          'Ocurrio un error al intentar crear un transaccion: ' +
          JSON.stringify(createTransactionDto),
      });
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const transaction = await this.transactionService.findOne(id);
      if (!transaction) throw new NotFoundException('No se hallo transaccion');
      const convertid = new GetTransactionDto(transaction);
      this.logger.log({
        function: 'findOne',
        layer: 'transaction.controller',
        msg: 'Se consulta  tansaccion ' + transaction.id_transaction,
      });
      return instanceToPlain(convertid, { excludeExtraneousValues: true });
    } catch (e) {
      this.logger.error({
        function: 'findOne',
        layer: 'transaction.controller',
        msg: 'Ocurrio un error al consultar  tansaccion ' + id,
        e,
      });
      throw e;
    }
  }
}
