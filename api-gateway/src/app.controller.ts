import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiDocResponse } from './modules/shared/infrastructure/decorators/api-doc-response.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  @ApiOperation({
    description: 'Application health check',
    operationId: 'health',
  })
  @ApiDocResponse({
    status: HttpStatus.OK,
    description: 'Application is ready',
    type: null,
  })
  @ApiOkResponse()
  @Get('health')
  health(): void {}
}
