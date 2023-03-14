import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PaginatorDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  page: number;

  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  size: number;
}
