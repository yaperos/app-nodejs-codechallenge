import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  redirect(@Res() res) {
    return res.redirect('/graphql');
  }
}
