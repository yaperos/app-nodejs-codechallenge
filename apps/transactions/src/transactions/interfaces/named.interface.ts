import { ApiProperty } from '@nestjs/swagger';

export class Named {
  @ApiProperty({
    description: 'The Name of the field',
  })
  name: string;
}
