import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    HttpStatus,
    HttpCode,
    UseInterceptors,
    ClassSerializerInterceptor,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
  } from '@nestjs/swagger';
  import { TransactionsService } from '../services/transactions.service';
  import { CreateTransactionDto } from '../dto/create-transaction.dto';
  import { TransactionResponseDto } from '../dto/transaction-response.dto';
  
  @ApiTags('transactions')
  @Controller('transactions')
  @UseInterceptors(ClassSerializerInterceptor)
  export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva transacción' })
    @ApiBody({ type: CreateTransactionDto })
    @ApiResponse({
      status: 201,
      description: 'Transacción creada exitosamente',
      type: TransactionResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(
      @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionResponseDto> {
      return this.transactionsService.create(createTransactionDto);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtener una transacción por ID' })
    @ApiParam({ name: 'id', description: 'ID de la transacción' })
    @ApiResponse({
      status: 200,
      description: 'Transacción encontrada',
      type: TransactionResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
    async findOne(@Param('id') id: string): Promise<TransactionResponseDto> {
      return this.transactionsService.findOne(id);
    }
  
    @Get()
    @ApiOperation({ summary: 'Obtener todas las transacciones' })
    @ApiResponse({
      status: 200,
      description: 'Lista de transacciones',
      type: [TransactionResponseDto],
    })
    async findAll(): Promise<TransactionResponseDto[]> {
      return this.transactionsService.findAll();
    }
  }