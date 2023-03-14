import { ApiProperty } from '@nestjs/swagger';

export class TransactionValidateDto {
  constructor(id: number, value: number) {
    this.id = id;
    this.value = value;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  value: number;
}
