import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TranferTypeService } from './tranfer-type.service';
import { CreateTranferTypeDto } from './dto/create-tranfer-type.dto';
import { UpdateTranferTypeDto } from './dto/update-tranfer-type.dto';

@Controller('tranfer-type')
export class TranferTypeController {
  constructor(private readonly tranferTypeService: TranferTypeService) {}

  @Post()
  create(@Body() createTranferTypeDto: CreateTranferTypeDto) {
    return this.tranferTypeService.create(createTranferTypeDto);
  }

  @Get()
  findAll() {
    return this.tranferTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tranferTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranferTypeDto: UpdateTranferTypeDto,
  ) {
    return this.tranferTypeService.update(+id, updateTranferTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tranferTypeService.remove(+id);
  }
}
