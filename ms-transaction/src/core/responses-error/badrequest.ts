import { ApiProperty } from '@nestjs/swagger';

export class BadRequestErrorResponse {
  @ApiProperty({ type: 'number', example: 400, description: 'Error code' })
  readonly statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'error message',
    description: 'Error message',
  })
  readonly message: string;

  @ApiProperty({
    type: 'string',
    example: 'error identifier',
    description: 'Error identifier',
  })
  readonly error: string;
}
