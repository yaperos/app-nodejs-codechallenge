import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateTransactionUseCases } from 'src/usecases/createTransaction.usecases';
import { CreateTransactionDto } from './transaction.dto';

@Controller('transaction')
@ApiTags('transaction')
@ApiResponse({status: 500, description: 'Internal Server Error'})
@ApiExtraModels()
export class TransactionController {

    constructor(
        @Inject(UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY)
        private readonly createTransactionUsecaseProxy: UseCaseProxy<CreateTransactionUseCases>
    ){}

    @Post('transaction')
    //@ApiResponseType()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto){
        const transactionCreated = await this.createTransactionUsecaseProxy.getInstance().execute(createTransactionDto);
        return 'created';
    }

}
