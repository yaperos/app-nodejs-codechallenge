import { Controller, Get, Post, Param, Body, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { GetTransactionResponseDto } from './dto/get-transaction-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiResponse({ status: 200, description: 'Lista de transacciones obtenida exitosamente' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transacción encontrada',
    type: GetTransactionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiBody({ 
    type: CreateTransactionDto,
    description: 'Datos para crear la transacción'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Transacción creada exitosamente',
    type: TransactionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una transacción' })
  @ApiResponse({ status: 204, description: 'Transacción eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}