import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransaction } from './dto/createTransaction.dto';
import { DataValidationInterceptor } from './interceptors/dataValidationInterceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("areyoualive")
  iAmAlive(): string {
    return " YES, I am Alive!";
  }

  @Post()
  @UseInterceptors(DataValidationInterceptor)
  createTransaction(@Body() createTransaction: CreateTransaction ) {response
    this.appService.createTransaction(createTransaction);
  }
}
