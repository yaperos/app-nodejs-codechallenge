import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionTypeDto {
  constructor(name: string) {
    this.name = name;
  }

  @ApiProperty()
  name: string;
}
