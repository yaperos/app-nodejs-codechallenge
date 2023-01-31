import { Body, Controller, Get, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateTransactionUseCases } from 'src/usecases/createTransaction.usecases';
import { GetTransactionUseCases } from 'src/usecases/getTransaction.usecases';
import { CreateTransactionDto } from './transaction.dto';
import { TransactionPresenter } from './transaction.presenter';

@Controller('transaction')
@ApiTags('transaction')
@ApiResponse({ status: 500, description: 'Internal server error' })
@ApiExtraModels(TransactionPresenter)
export class TransactionController {

    constructor(
        @Inject(UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY)
        private readonly createTransactionUsecaseProxy: UseCaseProxy<CreateTransactionUseCases>,
        @Inject(UsecasesProxyModule.GET_TRANSACTION_USERCASES_PROXY)
        private readonly getTransactionUsecaseProxy: UseCaseProxy<GetTransactionUseCases>
    ){}

    @Post()
    @ApiResponseType(TransactionPresenter, false)
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto){
        const transactionCreated = await this.createTransactionUsecaseProxy.getInstance().execute(createTransactionDto);

        return new TransactionPresenter(transactionCreated);
    }

    @Get(':id')
    @ApiResponseType(TransactionPresenter, false)
    async getTransaction(@Param('id') id: string){
        const transaction = await this.getTransactionUsecaseProxy.getInstance().execute(id);
        if(transaction === null ){
            throw new NotFoundException()
        }

        return new TransactionPresenter(transaction);
    }

}
