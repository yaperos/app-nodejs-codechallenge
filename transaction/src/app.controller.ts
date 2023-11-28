import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequestDto } from './dtos/create.transaction.request.dto';
import { UpdateTransactionDto } from './dtos/update.transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Crear una transacción
  @Post()
  async createTransaction(
    @Body() createTransactionRequestDto: CreateTransactionRequestDto,
  ) {
    return await this.appService.createTransaction(createTransactionRequestDto);
  }

  // Obtener una sola transacción
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appService.findOne(id);
  }

  // Obtener todas las transacciones
  @Get()
  findAll() {
    return this.appService.findAll();
  }

  // Actualizar una transacción
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateTransactionDto,
  ) {
    return this.appService.update(id, payload);
  }

  // Eliminar una transacción
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appService.remove(id);
  }
}
