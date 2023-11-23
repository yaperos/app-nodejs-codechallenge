import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProducerService } from './producer/producer.service';
import { TransactionsService } from './transactions/transactions.service';
import { log } from 'console';

@Controller()
export class AppController {
  constructor(
    private readonly transasctionService: TransactionsService,
    private readonly producerService: ProducerService,
  ) {}

  @Post('transaction')
  async createTransaction(@Body() transactionData: any) {
    this.transasctionService
      .create(transactionData)
      .catch((error) => {
        log(error);
      })
      .then((transaction) => {
        log('Transaction created', JSON.stringify(transaction));
        this.producerService.send('transactions', JSON.stringify(transaction));
      });
  }

  @Get('transaction/:id')
  getTransaction(@Param('id') id: string) {
    log('Getting transaction', id);
    return this.transasctionService.get(id);
  }
}
