import { Body, Controller, Get, HttpCode, Inject, NotFoundException, Param, Post, UseFilters } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AllExceptionFilter } from 'src/infrastructure/common/filter/exception.filter';
import { ApiResponseType } from 'src/infrastructure/common/swagger/response.decorator';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateTransactionUseCases } from 'src/usecases/createTransaction.usecases';
import { GetTransactionUseCases } from 'src/usecases/getTransaction.usecases';
import { CreateTransactionDto } from './transaction.dto';
import { TransactionPresenter } from './transaction.presenter';

@Controller('transaction')
@ApiTags('transaction')
@ApiExtraModels()
export class TransactionController {

    constructor(
        @Inject(UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY)
        private readonly createTransactionUsecaseProxy: UseCaseProxy<CreateTransactionUseCases>,
        @Inject(UsecasesProxyModule.GET_TRANSACTION_USERCASES_PROXY)
        private readonly getTransactionUsecaseProxy: UseCaseProxy<GetTransactionUseCases>
    ){}

    @Post()
    @HttpCode(201)
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto){
        const transactionCreated = await this.createTransactionUsecaseProxy.getInstance().execute(createTransactionDto);
        return transactionCreated;
    }

    @Get(':id')
    @HttpCode(200)
    @ApiResponseType(TransactionPresenter, false)
    async getTransaction(@Param('id') id: string){
        const transaction = await this.getTransactionUsecaseProxy.getInstance().execute(id);
        if(transaction === null ){
            throw new NotFoundException()
        }

        return new TransactionPresenter(transaction);
    }

}
