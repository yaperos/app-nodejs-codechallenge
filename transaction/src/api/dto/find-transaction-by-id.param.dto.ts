import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindTransactionByIdParamDTO {
  @IsString()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  readonly id: string;
}
