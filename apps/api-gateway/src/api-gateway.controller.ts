import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { CreateTransactionDto } from './dto/create-trasaction.dto';

@Controller('api')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('transactions')
  async createTransaction(@Body() body: CreateTransactionDto) {
    return this.apiGatewayService.createTransaction(body);
  }
}
