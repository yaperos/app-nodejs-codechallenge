import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiGatewayService } from '../services/api-gateway.service';
import { TransactionData } from '../interfaces/transaction';


@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('/send-transaction')
  createTransaction(@Body() data: TransactionData) {
    try {
      return this.apiGatewayService.createTransaction(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
