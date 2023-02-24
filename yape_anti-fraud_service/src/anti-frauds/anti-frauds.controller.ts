import { Controller, Post, Body } from '@nestjs/common';
import { AntiFraudsService } from './anti-frauds.service';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';

@Controller('anti-frauds')
export class AntiFraudsController {
  constructor(private readonly antiFraudsService: AntiFraudsService) { }

  @Post()
  create(@Body() createAntiFraudDto: CreateAntiFraudDto) {
    return this.antiFraudsService.create(createAntiFraudDto);
  }
}
