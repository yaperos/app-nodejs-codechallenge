import { ApiProperty } from '@nestjs/swagger';

import { ErrorBaseResponse } from './error-base-response';

export class ConflictResponseDto implements ErrorBaseResponse {
  @ApiProperty({
    type: String,
    example: 'Resource field duplicated',
    nullable: false,
  })
  message: string;
}
