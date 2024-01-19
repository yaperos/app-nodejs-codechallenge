import { ApiProperty } from '@nestjs/swagger';

import { ErrorBaseResponse } from './error-base-response';

export class BadRequestResponseDto implements ErrorBaseResponse {
  @ApiProperty({
    type: [String],
    example: ['Param invalid', 'Resource duplicate', 'Dependency invalid'],
    nullable: false,
  })
  message: Array<string> | string;
}
