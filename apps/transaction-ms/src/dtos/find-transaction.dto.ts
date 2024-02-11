import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneParams {
  @IsUUID()
  @ApiProperty({
    description: 'The transaction external id',
    example: '1f4ab17b-8548-4b76-a7fd-c94fc0b95b77',
  })
  @IsNotEmpty()
  id: string;
}
