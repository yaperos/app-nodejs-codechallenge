import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { returnValueOrThrowException } from '../../../../../core/domain/errors';
import { ValidateTransactionUseCase } from '../../../application/update';
import { ValidateTransactionRequest } from './transaction-controller.type';

@Controller()
export class TransactionController {
  constructor(
    private readonly validateTransactionUseCase: ValidateTransactionUseCase,
  ) {}

  @EventPattern('validate-transaction')
  async handleProcessPayment(
    @Payload() data: ValidateTransactionRequest,
  ): Promise<any> {
    const response = this.validateTransactionUseCase.execute(data);
    return returnValueOrThrowException(response);
  }
}
