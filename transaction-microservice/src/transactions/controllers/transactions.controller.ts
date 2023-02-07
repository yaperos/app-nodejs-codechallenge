import {
  Body,
  Controller,
  Post,
  Param,
  Inject,
  OnModuleInit,
  Get,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionsController implements OnModuleInit {
  constructor(
    private transactionService: TransactionsService,

    @Inject('TRANSACTIONSERVICE')
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['validate', 'response'].forEach((key) =>
      this.client.subscribeToResponseOf(`transaction.${key}`),
    );
  }

  // onModuleDestroy() {
  //   this.client.close();
  // }

  @Post()
  create(@Body() body: any) {
    return this.transactionService.create(body);
  }

  @Get('find/:id')
  getOneByFindId(
    @Param('id')
    id: string,
  ) {
    return this.transactionService.getOne(id);
  }
}
