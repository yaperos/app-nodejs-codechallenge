import { Param, Get, Controller, NotFoundException } from '@nestjs/common';
import {TransactionsService} from './transactions.service';
import {KafkaService} from "../kafka/kafka";

@Controller('transactions')
export class TransactionsController {

  public constructor(
    private transactionService: TransactionsService,
    private readonly events: KafkaService,
  ) {}

  @Get()
  public async findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  public async find(@Param('id') id: string) {
    const transaction = await this.transactionService.findOne(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  public handleTransactionApproved(data: any) {
    return this.transactionService.registerApproval(data);
  }

  public async onModuleInit() {
    this.events.subscribe(
      'transaction_approved',
      this.handleTransactionApproved.bind(this)
    );
    await this.events.init();
  }
}
