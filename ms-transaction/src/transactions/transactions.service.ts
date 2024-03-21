import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transClient: ClientKafka,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const data = await this.prisma.transaction.create({
      data: createTransactionDto,
    });
    this.transClient.emit('create_transaction', JSON.stringify(data));
    return data;
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findOne(id: number) {
    return this.prisma.transaction.findMany({ where: { id } });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
