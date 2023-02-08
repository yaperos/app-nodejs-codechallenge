import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    this.logger.debug('transaction request received');
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}
