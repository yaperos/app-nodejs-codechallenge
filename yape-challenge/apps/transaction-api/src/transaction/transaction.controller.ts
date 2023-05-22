import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDTO } from './aplication/dtos/create-transaction.dto';
import { GetTransactionDTO } from './aplication/dtos/get-transaction.dto';
import { ITransactionUseCasesPort } from './aplication/useCasesPorts/transaction-use-cases.port';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController implements OnModuleInit {
  constructor(@Inject('TransactionUseCases') private readonly transactionUseCasesPort: ITransactionUseCasesPort,
  @Inject('TRANSACTION_EVENT') private readonly kafkaClient: ClientKafka) {}

  @Post()
  public async create(@Body() createTransactionDto: CreateTransactionDTO) {
    const response = await this.transactionUseCasesPort.create(createTransactionDto);

    const request = JSON.stringify({
      transactionExternalId: response.id,
      value: response.value,
    });

    const status = await this.kafkaClient.send('transaction_created', request).toPromise();

    return await this.transactionUseCasesPort.update(response.id, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionUseCasesPort.getById(id);
  }

  @Get()
  getTransaction(@Query() transactionDto: GetTransactionDTO) {
    return this.transactionUseCasesPort.get(transactionDto);
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('transaction_created');
  }

}
