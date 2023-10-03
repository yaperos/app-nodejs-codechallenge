import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransaction } from './dto/createTransaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createTransaction(@Body() createTransaction: CreateTransaction ) {
    this.appService.createTransaction(createTransaction);
  }
}
