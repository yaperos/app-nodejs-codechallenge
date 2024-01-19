import { ApiProperty } from '@nestjs/swagger';

import { ErrorBaseResponse } from './error-base-response';

export class InternalServerErrorResponseDto implements ErrorBaseResponse {
  @ApiProperty({
    type: String,
    example: 'Internal server error',
    nullable: false,
  })
  message: string;
}
