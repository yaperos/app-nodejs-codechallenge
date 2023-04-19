import { Controller, Post, Body, Get, Param, InternalServerErrorException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Manejo de solicitudes Get HTTP

  @Get(':transactionExternalId')
  async findOne(@Param('transactionExternalId') transactionExternalId: string): Promise<any> {
    try {
      const newFndTransaction = await this.transactionService.findOneByTransactionExternalId(transactionExternalId);
      return newFndTransaction;
    } catch (error) {
      
       // Colector de errores
      throw new InternalServerErrorException(`Hubo un error encontrando la transacción: ${error.message}`)
    }
  }

  // Manejo de solicitudes Post HTTP

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<any> {
    try {
      const newTransaction = await this.transactionService.create(createTransactionDto);
      return newTransaction;
    } catch (error) {
      // Colector de errores
      throw new InternalServerErrorException(`Hubo un error creando la transacción: ${error.message}`);
    }
  }

}
