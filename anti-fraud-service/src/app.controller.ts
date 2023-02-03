import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern } from '@nestjs/microservices';
import { ShowTransactionDto } from './dto/show-transaction.dto';
import { ValidateService } from './validate.service';

@Controller()
export class AppController {
  constructor(private readonly validateService: ValidateService) {}

  @EventPattern('transaction')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateTransaction(transaction: ShowTransactionDto) {
    // validateTransaction(transaction: ShowTransactionDto) {
    console.log(`Received event: ${transaction}`);
    console.log(transaction);
    const result = this.validateService.validate(transaction);
    console.log(
      '🚀 ~ file: app.controller.ts:17 ~ AppController ~ validateTransaction ~ result',
      result,
    );
  }
}
