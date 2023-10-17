import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionStatusDto {
  constructor(name: string) {
    this.name = name;
  }

  @ApiProperty()
  name: string;
}
