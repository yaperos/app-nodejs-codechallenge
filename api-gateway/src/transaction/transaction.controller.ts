import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController implements OnModuleInit {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  async onModuleInit() {
    this.transactionClient.subscribeToResponseOf('transaction_created');
    await this.transactionClient.connect();
  }
}
