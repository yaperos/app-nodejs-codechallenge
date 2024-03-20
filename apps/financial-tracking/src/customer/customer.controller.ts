import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from './customer.dto';

@Controller('customer')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async all() {
    this.logger.log('All customers');
    return await this.customerService.all();
  }

  @Post()
  async create(@Body() data: CustomerDto) {
    this.logger.log('Customer created');
    return await this.customerService.create(data);
  }
}
