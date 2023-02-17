import { Body, Controller, Inject, Post } from '@nestjs/common/decorators';
import { ClientKafka } from '@nestjs/microservices';
import {
  eitherAsyncFromParseResult,
  returnValueOrThrowException,
} from '../../../../../core/domain/errors/error-utils';
import { RegisterTransactionUseCase } from '../../../application/create';
import {
  RegisterTransactionRequest,
  RegisterTransactionResponse,
  ZRegisterTransactionRequest,
} from './transaction-controller.type';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly registerTransactionUseCase: RegisterTransactionUseCase,
  ) {}

  @Post()
  async registerTransaction(
    @Body() body: RegisterTransactionRequest,
  ): Promise<RegisterTransactionResponse> {
    const response = await eitherAsyncFromParseResult(
      ZRegisterTransactionRequest.safeParse(body),
    ).chain((parsed) => this.registerTransactionUseCase.execute(parsed));
    return returnValueOrThrowException(response);
  }
}
