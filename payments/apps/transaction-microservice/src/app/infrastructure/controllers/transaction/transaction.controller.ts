import { Controller, Inject, ParseIntPipe, ParseUUIDPipe, UseFilters, ValidationPipe} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto, TransactionPresenter, UpdateTransactionDto } from '@payments/shared/dto';
import { CreateTransactionUseCases } from '../../../usecases/create-transaction.usecases';
import { GetTransactionUseCases } from '../../../usecases/get-transaction.usecases';
import { UpdateTransactionUseCases } from '../../../usecases/update-transaction.usecases';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';

@Controller()
export class TransactionController {

    constructor(
        @Inject(UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY)
        private readonly createTransactionUsecaseProxy: UseCaseProxy<CreateTransactionUseCases>,
        @Inject(UsecasesProxyModule.GET_TRANSACTION_USERCASES_PROXY)
        private readonly getTransactionUsecaseProxy: UseCaseProxy<GetTransactionUseCases>,
        @Inject(UsecasesProxyModule.UPDATE_TRANSACTION_USERCASES_PROXY)
        private readonly updateTransactionUsecaseProxy: UseCaseProxy<UpdateTransactionUseCases>
    ){}

    @MessagePattern('create-transaction')
    async handleCreateTransaction(@Payload(ValidationPipe) createTransactionDto: CreateTransactionDto){
        const transactionCreated = await this.createTransactionUsecaseProxy.getInstance().execute(createTransactionDto);
        return new TransactionPresenter(transactionCreated);
    }

    @MessagePattern('update-transaction')
    async handleUpdateTransaction(@Payload(ValidationPipe) updateTransactionDto: UpdateTransactionDto){
        const transactionUpdated = await this.updateTransactionUsecaseProxy.getInstance().execute(updateTransactionDto);
        return new TransactionPresenter(transactionUpdated);
    }
    
    @MessagePattern('get-transaction')
    async handleGetTransaction(@Payload(ParseUUIDPipe) id: string){
        const transactionUpdated = await this.getTransactionUsecaseProxy.getInstance().execute(id);
        return new TransactionPresenter(transactionUpdated);
    }

}