import { Body, Controller, Post, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiGatewayTimeoutResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import {
  GenericError,
  ResponseDescription,
} from '../../../core/presentation/errors/generic-error';
import { TransactionCreatedResponse } from '../../application/dtos/transaction-created.dto';
import { TransactionApplication } from '../../application/transaction.application';
import { Transaction, TransactionProps } from '../../domain/transaction';
import { TransactionCreateDto } from './dtos/transaction-create.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly application: TransactionApplication) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiCreatedResponse({
    description: 'The transaction has been successfully created.',
    type: TransactionCreatedResponse,
  })
  @ApiBadRequestResponse({
    type: GenericError,
    description: ResponseDescription.BAD_REQUEST,
  })
  @ApiInternalServerErrorResponse({
    type: GenericError,
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  @ApiGatewayTimeoutResponse({
    type: GenericError,
    description: ResponseDescription.API_GATEWAY_TIMEOUT,
  })
  async create(@Body() transaction: TransactionCreateDto) {
    const transactionId = uuidv4();

    const props: TransactionProps = { ...transaction, transactionId };
    const instanceTransaction = new Transaction(props);

    return await this.application.save(instanceTransaction);
  }
}
