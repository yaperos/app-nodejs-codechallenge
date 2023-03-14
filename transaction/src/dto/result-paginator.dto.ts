import { ApiProperty } from '@nestjs/swagger';

export class ResultPaginator<T> {
  constructor(result: T[], total: number) {
    this.result = result;
    this.total = total;
  }

  @ApiProperty()
  result: T[];

  @ApiProperty()
  total: number;
}
