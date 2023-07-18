import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async create(@Body() createTransferDto: CreateTransferDto) {
    const resp = await this.transferService.create(createTransferDto);
    if(!resp) throw new BadRequestException('Transfer incorrect data')
    return resp;
    // return ''
  }

  @Post('/adition')
  async dataAdition() {
    const resp = await this.transferService.dataAdition();
    if(!resp) throw new BadRequestException('Transfer incorrect data')
    return resp;
  }

  @Get()
  findAll() {
    return this.transferService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const transfer = await this.transferService.findOne(+id);
    if (!transfer) {
      throw new NotFoundException('Transfer does not exist!');
    } else {
      return transfer;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferDto: UpdateTransferDto) {
    return this.transferService.update(+id, updateTransferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferService.remove(+id);
  }
}
