import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from 'src/models/transaction.dto';

@Controller('transaction')
export class TransactionController {
  logger = new Logger(TransactionController.name);
  constructor(private transactionService: TransactionService) {}
  @Get()
  public async getAll() {
    this.logger.debug('Get all transactions');
    return await this.transactionService.getAll();
  }
  @Get(':id')
  public async getOne(@Param() params: any): Promise<any> {
    this.logger.debug('Get transaction by id');
    return await this.transactionService.getOne(params.id);
  }
  @Post()
  public async save(@Body() transaction: TransactionDto) {
    this.logger.debug('Saving transaction ' + JSON.stringify(transaction));
    return await this.transactionService.save(transaction);
  }
  @Patch(':id')
  public async updateStatus(
    @Param() { id }: TransactionDto,
    @Body() transaction: TransactionDto,
  ) {
    this.logger.debug('Updating transaction status ' + id);
    return await this.transactionService.updateStatus(id, transaction.status);
  }
}
