import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { TRANSACTION_STATUS_ID } from 'src/application/constant';
import {
  TransactionInterface,
  TransactionInterfaceRequest,
} from 'src/domain/transaction/transaction.model';
import { LoggerService } from '../logger/logger.service';
import { buildLog } from '../../helper/buildLog';
import { TransactionService } from './transaction.service';
import { AntiFraudService } from '../antiFraud/antiFraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { msConfig } from 'src/infraestructure/config';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly transactionService: TransactionService,
    private readonly antiFraudService: AntiFraudService,
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
          mission: 'create-transaction',
        }),
      );
      throw new InternalServerErrorException(error);
    }

    try {
      this.antiFraudService.verifyTransaction(trx);
    } catch (error) {
      this.loggerService.report(
        'error',
        buildLog('error', trx.transactionExternalId, {
          request: { ...data },
          transaction: { ...trx },
          error,
          mission: 'send-verify-transaction',
        }),
      );
      throw new InternalServerErrorException(error);
    }

    return trx;
  }

  @EventPattern(`${msConfig.nameTransactions}-update-transaction-accepted`)
  async updateTransactionAccepted(
    @Payload(ValidationPipe) trx: TransactionInterface,
  ) {
    try {
      console.log('accepted');
      console.log(trx);

      await this.transactionService.updateTransaction(trx);
    } catch (error) {
      this.loggerService.report(
        'error',
        buildLog('error', trx.transactionExternalId, {
          request: { ...trx },
          transaction: { ...trx },
          error,
          mission: 'update-transaction-accepted',
        }),
      );
      throw new InternalServerErrorException(error);
    }
  }

  @EventPattern(`${msConfig.nameTransactions}-update-transaction-rejected`)
  async updateTransactionRejected(
    @Payload(ValidationPipe) trx: TransactionInterface,
  ) {
    try {
      console.log('rejected');
      console.log(trx);

      await this.transactionService.updateTransaction(trx);
    } catch (error) {
      this.loggerService.report(
        'error',
        buildLog('error', trx.transactionExternalId, {
          request: { ...trx },
          transaction: { ...trx },
          error,
          mission: 'update-transaction-rejected',
        }),
      );
      throw new InternalServerErrorException(error);
    }
  }
}
