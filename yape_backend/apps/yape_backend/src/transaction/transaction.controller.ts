import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MessengerService } from '../messenger/messenger.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly messengeService: MessengerService,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction =
      await this.transactionService.create(createTransactionDto);
    const analizedTransaction = await this.messengeService
      .handleAnalizeTransaction(transaction)
      .then(async (analizedTransaction) => {
        return analizedTransaction;
      });
    return analizedTransaction;
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
