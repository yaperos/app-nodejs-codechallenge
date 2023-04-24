import { Controller, Get, HttpStatus } from '@nestjs/common';
import { INFO_RESPONSES } from '../../config/constants/response';

@Controller('')
export class AliveHttpController {
  @Get('/status/alive')
  status() {
    return {
      status: HttpStatus.OK,
      message: INFO_RESPONSES.ALIVE_OK.MESSAGE,
    };
  }
}
