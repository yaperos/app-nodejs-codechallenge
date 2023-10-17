import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
  Param,
  Inject,
  HttpException,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { GetTransactionRequest } from './dto/get-transaction-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionResponse } from './dto/transaction-response.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  async onModuleInit() {
    ['transaction-get', 'transaction-get-all', 'transaction-create'].forEach(
      (key) => this.transactionClient.subscribeToResponseOf(`${key}`),
    );
    await this.transactionClient.connect();
  }

  async onModuleDestroy() {
    await this.transactionClient.close();
  }

  @ApiExcludeEndpoint()
  @Get()
  getHello(@Res() res): string {
    return res.redirect('/api');
  }

  @ApiResponse({
    status: 200,
    type: TransactionResponse,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all transactions' })
  @Get('transaction')
  listTransaction() {
    return this.transactionClient.send('transaction-get-all', {});
  }

  @Post('transaction')
  @ApiOperation({ summary: 'Create new transaction' })
  @ApiResponse({
    status: 201,
    type: TransactionResponse,
  })
  createTransaction(
    @Body(ValidationPipe) createTransactionRequest: CreateTransactionRequest,
  ) {
    console.log('New transaction received.');
    return this.transactionClient.send(
      'transaction-create',
      JSON.stringify(createTransactionRequest),
    );
  }

  @Get('transaction/:id')
  @ApiOperation({ summary: 'Get transaction by transactionExternalId' })
  @ApiResponse({
    status: 200,
    type: TransactionResponse,
  })
  async getTransaction(@Param() params: GetTransactionRequest) {
    return new Promise((resolve, reject) => {
      this.transactionClient
        .send('transaction-get', params.id)
        .subscribe((result) => {
          const resultJson =
            typeof result === 'string' ? JSON.parse(result) : result;
          if (!resultJson) {
            reject(new HttpException('Transaction not found', 404));
          }
          resolve(result);
        });
    });
  }
}
