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
import { TRANSACTION_STATUS_ID } from '../../../../application/constant';
import {
  TransactionInterface,
  TransactionInterfaceRequest,
} from '../../../../domain/transaction/transaction.model';
import { LoggerService } from '../../logger/logger.service';
import { TransactionService } from './transaction.service';
import { AntiFraudService } from '../../antiFraud/antiFraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { msConfig } from '../../../../infraestructure/config';

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
      { transaction: trx, mission: 'create-transaction' },
      trx.transactionExternalId,
    );

    try {
      await this.transactionService.createTransaction(trx);
    } catch (error) {
      this.loggerService.report(
        'error',
        { transaction: trx, error, mission: 'error-create-transaction' },
        trx.transactionExternalId,
      );
      throw new InternalServerErrorException(error);
    }

    this.loggerService.report(
      'log',
      { transaction: trx, mission: 'created-transaction-succesfully' },
      trx.transactionExternalId,
    );

    this.antiFraudService.verifyTransaction(trx);

    this.loggerService.report(
      'log',
      { transaction: trx, mission: `send-${msConfig.nameAntiFraud}` },
      trx.transactionExternalId,
    );

    return trx;
  }

  @EventPattern(`${msConfig.nameTransactions}-update-transaction-accepted`)
  async updateTransactionAccepted(
    @Payload(ValidationPipe) trx: TransactionInterface,
  ) {
    this.loggerService.report(
      'log',
      { transaction: trx, mission: `updating-transaction-accepted` },
      trx.transactionExternalId,
    );

    try {
      await this.transactionService.updateTransaction(trx);
      this.loggerService.report(
        'log',
        { transaction: trx, mission: `updated-transaction-accepted` },
        trx.transactionExternalId,
      );
    } catch (error) {
      this.loggerService.report(
        'error',
        { transaction: trx, error, mission: `error-update-transaction` },
        trx.transactionExternalId,
      );
      throw new InternalServerErrorException(error);
    }
  }

  @EventPattern(`${msConfig.nameTransactions}-update-transaction-rejected`)
  async updateTransactionRejected(
    @Payload(ValidationPipe) trx: TransactionInterface,
  ) {
    this.loggerService.report(
      'log',
      { transaction: trx, mission: `updating-transaction-rejected` },
      trx.transactionExternalId,
    );

    try {
      await this.transactionService.updateTransaction(trx);
      this.loggerService.report(
        'log',
        { transaction: trx, mission: `updated-transaction-rejected` },
        trx.transactionExternalId,
      );
    } catch (error) {
      this.loggerService.report(
        'error',
        {
          transaction: trx,
          error,
          mission: `error-updated-transaction-rejected`,
        },
        trx.transactionExternalId,
      );
      throw new InternalServerErrorException(error);
    }
  }
}
