import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService, private readonly producerService: ProducerService) { }

  async create(createTransactionDto: CreateTransactionDto) {
    const data = this.prisma.transaction.create({ data: createTransactionDto });

    await this.producerService.produce({
      topic: 'test',
      messages: [{ value: 'test' }],
    });

    return data;
  }

  findAll() {
    return this.prisma.transaction.findMany({});
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }
}
