import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';

import { CreateTransactionDto, TransactionDto } from './transactions.dto';
import { LoggerService } from '@shared/logger/logger.service';
import { SERVICE_ERROR } from '@config/errors.enum';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController extends LoggerService {
  constructor(private readonly transactionsService: TransactionsService) {
    super(TransactionsController.name);
  }

  @Post('/')
  async createTransaction(
    @Headers('trace_id') traceId: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() response,
  ): Promise<any> {
    try {
      const transaction: TransactionDto =
        await this.transactionsService.createTransaction(createTransactionDto);

      return response.status(200).json(transaction);
    } catch (error) {
      const errorArray = [];
      errorArray.push({
        origin: `${
          SERVICE_ERROR.TRANSACTIONS_CHALLENGE
        }_${TransactionsController.name.toUpperCase()}_CREATE_TRANSACTION`,
        trace_id: traceId,
        message: error.message,
      });
      this.logger.error(errorArray);

      return response.status(500).json(errorArray);
    }
  }

  @Get('/:transactionExternalId')
  async getTransactionByExternalId(
    @Headers('trace_id') traceId: string,
    @Param('transactionExternalId', new ParseUUIDPipe())
    transactionExternalId: string,
    @Res() response,
  ): Promise<any> {
    try {
      const transaction: TransactionDto =
        await this.transactionsService.getTransactionByExternalId(
          transactionExternalId,
        );

      return response.status(200).json(transaction);
    } catch (error) {
      const errorArray = [];
      errorArray.push({
        origin: `${
          SERVICE_ERROR.TRANSACTIONS_CHALLENGE
        }_${TransactionsController.name.toUpperCase()}_GET_TRANSACTION_BY_EXTERNAL_ID`,
        trace_id: traceId,
        message: error.message,
      });
      this.logger.error(errorArray);

      return response.status(500).json(errorArray);
    }
  }
}
