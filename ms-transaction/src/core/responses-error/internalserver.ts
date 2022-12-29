import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
  @ApiProperty({ type: 'number', example: 500, description: 'Error code' })
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
