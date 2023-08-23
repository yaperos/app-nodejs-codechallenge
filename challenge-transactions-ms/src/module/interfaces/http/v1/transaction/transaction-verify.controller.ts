import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiGatewayTimeoutResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransactionVerifyDto } from './dto/create-transaction-verify.dto';

import { ResponseDescription } from '../../../helpers/response.description';
import { GenericError } from 'src/module/interfaces/helpers/generic-error';
import { SaveTransactionVerifyEventCommand } from 'src/module/application/command/save-transaction-verify-event.command';
import { TransactionGenericApiResponse } from 'src/core/helpers/generic-response';
import { TransactionVerifyResponseDto } from 'src/module/application/dto/response-transaction-verify.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionVerifyRequestDto } from './dto/transaction-verify-request.dto';
import { UpdateTransactionVerifyEventCommand } from 'src/module/application/command/update-transaction-verify-event.command';
import { GetTransactionVerifyDto } from './dto/get-transaction-verify-by-id.dto';
import { GetTransactionVerifyEventCommand } from 'src/module/application/query/get-transaction-verify-event.query';

@ApiTags('transaction-verify')
@Controller('transaction-verify')
export class TransactionVerifyController {
  constructor(
    private readonly logger: Logger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':transactionExternalId')
  @ApiOperation({
    summary: 'Get transacion operation with transactionExternalId',
  })
  @ApiResponse({
    status: 200,
    description: 'Trasnaction List Is Successful',
    type: TransactionVerifyResponseDto,
  })
  @ApiBadRequestResponse({
    type: GenericError,
    description: ResponseDescription.BAD_REQUEST,
  })
  @ApiNotFoundResponse({
    type: GenericError,
    description: ResponseDescription.FEATURE_FLAG_NOT_FOUND,
  })
  @ApiInternalServerErrorResponse({
    type: GenericError,
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  @ApiGatewayTimeoutResponse({
    type: GenericError,
    description: ResponseDescription.API_GATEWAY_TIMEOUT,
  })
  async getTransactionVerify(
    @Param(ValidationPipe) pathTransactionVerifyDto: GetTransactionVerifyDto,
  ): Promise<TransactionGenericApiResponse> {
    this.logger.log('Init Get Transaction Verify By Id ');
    const command = new GetTransactionVerifyEventCommand(
      pathTransactionVerifyDto.transactionExternalId,
    );
    return this.queryBus.execute(command);
  }

  @Post()
  @ApiOperation({
    summary: 'Save new transactiion',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction saved successfully',
    type: TransactionVerifyResponseDto,
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
  async saveTransactionVerify(
    @Body(ValidationPipe) body: CreateTransactionVerifyDto,
  ): Promise<TransactionGenericApiResponse> {
    this.logger.log('Init saveTransactionVerify');
    const command = new SaveTransactionVerifyEventCommand(body);
    const result = await this.commandBus.execute(command);
    return result;
  }

  @MessagePattern('transaction-verify-update-ms')
  async handleEventUpdateStatusTransactionVerify(
    @Payload() transactionVerifyRequestDto: TransactionVerifyRequestDto,
  ) {
    this.logger.log('Init handleEventUpdateTransaction');
    const command = new UpdateTransactionVerifyEventCommand(
      transactionVerifyRequestDto,
    );
    await this.commandBus.execute(command);
  }
}
