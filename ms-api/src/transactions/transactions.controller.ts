import {
  Param,
  Get,
  Controller,
  NotFoundException,
  Post,
  Res,
  Body,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import {TransactionsService} from './transactions.service';
import {KafkaService} from '../kafka/kafka';
import {CreateTransactionDto} from '../dto/create_transaction';

@Controller('transactions')
export class TransactionsController {

  public constructor(
    private transactionService: TransactionsService,
    private readonly events: KafkaService,
  ) {}

  @Post()
  public async createTransaction(@Res() response, @Body() createTransactionDto: CreateTransactionDto) {
    try {
      const transaction = await this.transactionService.create(createTransactionDto);

      return response.status(HttpStatus.CREATED)
        .json(transaction);
    } catch (err) {
      throw new BadRequestException('Transaction not created');
    }
  }

  @Get()
  public async findAll(@Res() response) {
    const list = await this.transactionService.findAll();

    return response.status(HttpStatus.OK)
      .json(list);
  }

  @Get(':id')
  public async find(@Res() response, @Param('id') id: string) {
    const transaction = await this.transactionService.findOne(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return response.status(HttpStatus.OK)
      .json(transaction);
  }

  public handleTransactionApproved(data: any) {
    return this.transactionService.registerApproval(data);
  }

  public handleTransactionRejected(data: any) {
    return this.transactionService.registerRejection(data);
  }

  public async onModuleInit() {
    this.events.subscribe(
      'transaction_approved',
      this.handleTransactionApproved.bind(this)
    );
    this.events.subscribe(
      'transaction_rejected',
      this.handleTransactionRejected.bind(this)
    );
    await this.events.init();
  }
}
