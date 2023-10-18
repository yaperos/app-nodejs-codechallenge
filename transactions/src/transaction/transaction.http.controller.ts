import {
  Body,
  Controller,
  Get,
  Injectable,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Scope,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDtoV2 } from './dto/get-transaction.dto';
import { LoggerService } from '../shared/logger/logger.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDtoV2 } from './dto/create-transaction-v2.dto';

@Controller('transaction')
export class TransactionHttpController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly logger: LoggerService,
  ) {}

  // @Post()
  // async create(@Body() createTransactionDto: CreateTransactionDto) {
  //   try {
  //     const trans = await this.transactionService.create(
  //       CreateTransactionDto.toPartialTransaction(createTransactionDto),
  //     );
  //     this.logger.log({
  //       function: 'create',
  //       layer: 'transaction.controller',
  //       msg: 'Se crea nueva transaccion ' + trans.transaction_external_id,
  //       transaction: trans,
  //     });
  //     console.log(trans);
  //     return GetTransactionDtoV2.fromTransaction(trans);
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //   } catch (e: Error) {
  //     this.logger.error({
  //       function: 'create',
  //       layer: 'transaction.controller',
  //       trace: e.stack,
  //       msg:
  //         'Ocurrio un error al intentar crear un transaccion: ' +
  //         JSON.stringify(createTransactionDto),
  //     });
  //     throw e;
  //   }
  // }

  @Post()
  async create(@Body() data: CreateTransactionDtoV2) {
    try {
      const trans = await this.transactionService.create(data);
      this.logger.log({
        function: 'create',
        layer: 'transaction.controller',
        msg: 'Se crea nueva transaccion ' + trans.transaction_external_id,
        transaction: trans,
      });
      console.log(trans);
      return trans;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } catch (e: Error) {
      this.logger.error({
        function: 'create',
        layer: 'transaction.controller',
        trace: e.stack,
        msg:
          'Ocurrio un error al intentar crear un transaccion: ' +
          JSON.stringify(data),
      });
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const transaction = await this.transactionService.findOne(id);
      console.log(transaction);
      if (!transaction) throw new NotFoundException('No se hallo transaccion');
      this.logger.log({
        function: 'findOne',
        layer: 'transaction.controller',
        msg: 'Se consulta  transaccion ' + transaction.transaction_external_id,
      });
      return transaction;
      //return GetTransactionDtoV2.fromTransaction(transaction);
    } catch (e) {
      this.logger.error({
        function: 'findOne',
        layer: 'transaction.controller',
        msg: 'Ocurrio un error al consultar  transaccion ' + id,
        e,
      });
      throw e;
    }
  }
}
