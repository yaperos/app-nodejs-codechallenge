import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Logger,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger();
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @MessagePattern('update_transaction')
  handleTransactionUpdate(data: any) {
    this.logger.debug('Transaction response ', data);
    const updateStatus: UpdateTransactionDto = { status: data.status };
    if (!this.findOne(data.id)) this.logger.error(`Transaction id not found`);
    return this.transactionsService.update(+data.id, updateStatus);
  }
}
