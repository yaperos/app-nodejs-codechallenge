import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.usecase';
import { GetTransactionUseCase } from 'src/application/use-cases/get-transaction.usecase';

@Controller()
export class TransactionMessageController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
  ) {}

  @MessagePattern('create-transaction') // topic/patrón
  async create(@Payload() data: any) {
    // data contendrá la info del evento
    return this.createTransactionUseCase.execute(data);
  }

  @MessagePattern('get-transaction')
  async get(@Payload() transactionExternalId: string) {
    return this.getTransactionUseCase.execute(transactionExternalId);
  }
}
