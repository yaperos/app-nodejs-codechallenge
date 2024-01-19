import { ApiProperty } from '@nestjs/swagger';

import { ErrorBaseResponse } from './error-base-response';

export class NotFoundResponseDto implements ErrorBaseResponse {
  @ApiProperty({
    type: String,
    example: 'Resource not found',
    nullable: false,
  })
  message: string;
}
