import { ApiProperty } from '@nestjs/swagger';

import { ErrorBaseResponse } from './error-base-response';

export class UnprocessableEntityResponseDto implements ErrorBaseResponse {
  @ApiProperty({
    type: String,
    example: 'Invalid value',
    nullable: false,
  })
  message: string;
}
