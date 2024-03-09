import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { TRANSACTION_STATUS_ID } from 'src/application/constant';
import {
  TransactionInterface,
  TransactionInterfaceRequest,
} from 'src/domain/transaction/transaction.model';
import { LoggerService } from '../logger/logger.service';
import { buildLog } from '../helper/buildLog';
import { TransactionService } from './transaction.service';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @HttpCode(201)
  async createTransaction(
    @Body() data: TransactionInterfaceRequest,
  ): Promise<TransactionInterface> {
    const trx: TransactionInterface = {
      type: data.tranferTypeId,
      status: TRANSACTION_STATUS_ID.PENDING,
      value: data.value,
      transactionExternalId: randomUUID(),
    };

    this.loggerService.report(
      'log',
      buildLog('log', trx.transactionExternalId, {
        request: { ...data },
        transaction: { ...trx },
        mission: 'createTransaction',
      }),
    );

    try {
      await this.transactionService.createTransaction(trx);
    } catch (error) {
      this.loggerService.report(
        'error',
        buildLog('error', trx.transactionExternalId, {
          request: { ...data },
          transaction: { ...trx },
          error,
          mission: 'createTransaction',
        }),
      );
      throw new InternalServerErrorException(error);
    }

    return trx;
  }
}
