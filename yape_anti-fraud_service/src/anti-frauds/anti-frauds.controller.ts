import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AntiFraudsService } from './anti-frauds.service';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { UpdateAntiFraudDto } from './dto/update-anti-fraud.dto';

@Controller('anti-frauds')
export class AntiFraudsController {
  constructor(private readonly antiFraudsService: AntiFraudsService) {}

  @Post()
  create(@Body() createAntiFraudDto: CreateAntiFraudDto) {
    return this.antiFraudsService.create(createAntiFraudDto);
  }

  @Get()
  findAll() {
    return this.antiFraudsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.antiFraudsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAntiFraudDto: UpdateAntiFraudDto) {
    return this.antiFraudsService.update(+id, updateAntiFraudDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.antiFraudsService.remove(+id);
  }
}
