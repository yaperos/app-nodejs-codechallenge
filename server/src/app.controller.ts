import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get()
  redirect(@Res() res) {
    return res.redirect('/graphql');
  }
}
