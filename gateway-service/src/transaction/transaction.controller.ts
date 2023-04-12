import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit, Post,
  Query,
  Req,
} from '@nestjs/common';
import {ClientKafka} from '@nestjs/microservices';
import {Request} from 'express';

@Controller('transaction')
export class TransactionController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('GATEWAY_SERVICE') private readonly client: ClientKafka,
  ) {
  }

  async onModuleInit() {
    await this.client.subscribeToResponseOf('user.balance');
    await this.client.subscribeToResponseOf('transaction.create');
    await this.client.connect();
    console.log('TRANSACTION CONTROLLER INITIALIZED')
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get('balance')
  async getUserBalance(
    @Query('id') req,
    @Body() body
  ): Promise<any> {
    const payload = {
      requestId: body.requestId,
      request: {userID: req,}
    };
    return this.client.send('user.balance', payload);
  }

  @Post('createTransaction')
  async createTransaction(@Body() body: transactionDTO): Promise<any> {
    const payload = {
      requestId: body.requestId,
      payload: {
        accountExternalIdDebit: body.accountExternalIdDebit,
        accountExternalIdCredit: body.accountExternalIdCredit,
        amount: body.amount,
        transferTypeId: body.transferTypeId,
      }
    }
    return this.client.send('transaction.create', payload);
  }
}

export interface transactionDTO {
  requestId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  amount: number;
  transferTypeId: number;
}
