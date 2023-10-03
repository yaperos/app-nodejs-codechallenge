import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransaction } from './dto/createTransaction.dto';
import { DataValidationInterceptor } from './interceptors/dataValidationInterceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(DataValidationInterceptor)
  createTransaction(@Body() createTransaction: CreateTransaction ) {
    this.appService.createTransaction(createTransaction);
  }
}
