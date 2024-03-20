import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerDto } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.customer.findMany();
  }

  async create(data: CustomerDto) {
    return await this.prismaService.customer.create({ data });
  }
}
