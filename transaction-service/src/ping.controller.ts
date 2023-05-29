import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators';

@Controller({
  version: VERSION_NEUTRAL,
})
@ApiTags('Ping')
export class PingController {
  @Public()
  @Get('/ping')
  ping() {
    return 'OK';
  }
}
