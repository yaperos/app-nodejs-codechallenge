import { Controller, Get } from '@nestjs/common';
import { PagesService } from '../services/pages.service';

@Controller()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  getHello(): string {
    return this.pagesService.getHello();
  }
}
