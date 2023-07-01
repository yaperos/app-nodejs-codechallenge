import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases_proxy/usecases-proxy.module';
import { UseCaseProxy } from '../usecases_proxy/usecases-proxy';
import { ReadTransactionUseCase } from '@/usecases/read.transaction.usecases';
import { ReadOneTransactionUseCase } from '@/usecases/readone.transaction.usecases';
import { UpdateTransactionUseCase } from '@/usecases/update.transaction.usecases';
import { CreateTransactionUseCase } from '@/usecases/create.transaction.usecases';
import { TransactionEntity } from '@/domain/model/transaction.model';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(UsecasesProxyModule.GET_TRANSACTION_USECASES_PROXY)
    private readonly getTransactionUsecaseProxy: UseCaseProxy<ReadTransactionUseCase>,
    @Inject(UsecasesProxyModule.GET_TRANSACTION_BY_ID_USECASES_PROXY)
    private readonly getTransactionByIdUsecaseProxy: UseCaseProxy<ReadOneTransactionUseCase>,
    @Inject(UsecasesProxyModule.PUT_TRANSACTION_USECASES_PROXY)
    private readonly updateTransactionUsecaseProxy: UseCaseProxy<UpdateTransactionUseCase>,
    @Inject(UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY)
    private readonly addTransactionUsecaseProxy: UseCaseProxy<CreateTransactionUseCase>,
  ) {}

  @Post()
  async create(@Body() transactionEntity: TransactionEntity) {
    return await this.addTransactionUsecaseProxy
      .getInstance()
      .execute(transactionEntity);
  }

  @Get()
  async find() {
    return await this.getTransactionUsecaseProxy.getInstance().execute();
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    return await this.getTransactionByIdUsecaseProxy.getInstance().execute(id);
  }

  @MessagePattern('transaction-verified')
  async update(@Payload() data: any) {
    const { id, status } = data;
    return await this.updateTransactionUsecaseProxy
      .getInstance()
      .execute(id, status);
  }
}
