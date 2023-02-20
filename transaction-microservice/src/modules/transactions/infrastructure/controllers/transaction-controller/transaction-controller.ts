import { Body, Controller, Get, Param, Post } from '@nestjs/common/decorators';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  eitherAsyncFromParseResult,
  eitherAsyncFromSchema,
  returnValueOrThrowException,
} from '../../../../../core/domain/errors';
import { RegisterTransactionUseCase } from '../../../application/create';
import { FindOneTransactionByIdUseCase } from '../../../application/find';
import { UpdateTransactionStatusUseCase } from '../../../application/update';
import {
  FindOneTransactionByIdResponse,
  RegisterTransactionRequest,
  RegisterTransactionResponse,
  UpdateTransactionStatusRequest,
  ZFindOneTransactionByIdRequest,
  ZRegisterTransactionRequest,
  ZUpdateTransactionStatusRequest,
} from './transaction-controller.type';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly registerTransactionUseCase: RegisterTransactionUseCase,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    private readonly findTransactionByIdUseCase: FindOneTransactionByIdUseCase,
  ) {}

  @Post()
  async registerTransaction(
    @Body() body: RegisterTransactionRequest,
  ): Promise<RegisterTransactionResponse> {
    const response = await eitherAsyncFromParseResult(
      ZRegisterTransactionRequest.safeParse(body),
    )
      .chain((parsed) => this.registerTransactionUseCase.execute(parsed))
      .map((transaction) => {
        return {
          transactionExternalId: transaction.id,
          transactionType: {
            name: transaction.transferType.name,
          },
          transactionStatus: {
            name: transaction.status,
          },
          value: transaction.value,
          createdAt: transaction.createdAt.toISOString().split('T')[0],
        };
      });
    return returnValueOrThrowException(response);
  }

  @EventPattern('validated-transaction')
  async registerTransactionValidation(
    @Payload() data: UpdateTransactionStatusRequest,
  ): Promise<void> {
    const response = await eitherAsyncFromParseResult(
      ZUpdateTransactionStatusRequest.safeParse(data),
    ).chain((parsed) => this.updateTransactionStatusUseCase.execute(parsed));
    return returnValueOrThrowException(response);
  }

  @Get('/:id')
  async getTransaction(
    @Param() params: unknown,
  ): Promise<FindOneTransactionByIdResponse> {
    const response = await eitherAsyncFromSchema(
      ZFindOneTransactionByIdRequest,
      params,
    )
      .chain((parsed) => this.findTransactionByIdUseCase.execute(parsed))
      .map((transaction) => {
        return {
          transactionExternalId: transaction.id,
          transactionType: {
            name: transaction.transferType.name,
          },
          transactionStatus: {
            name: transaction.status,
          },
          value: transaction.value,
          createdAt: transaction.createdAt.toISOString().split('T')[0],
        };
      });
    return returnValueOrThrowException(response);
  }
}
