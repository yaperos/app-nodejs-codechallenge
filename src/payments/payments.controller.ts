import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentService.createPayment(dto);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.paymentService.getPaymentById(id);
  }
}
