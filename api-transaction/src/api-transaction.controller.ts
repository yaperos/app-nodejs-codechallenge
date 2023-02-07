import { Controller, Post, Body } from '@nestjs/common';
import { ApiGatewayService } from './api-transaction.service';
import { IRequestTransactionCreate } from './interfaces/create-transaction';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('/transaction')
  createTransaction(@Body() data: IRequestTransactionCreate) {
    try {
      return this.apiGatewayService.createTransaction(data);
    } catch (error) {
      console.error(error);
    }
  }
}
