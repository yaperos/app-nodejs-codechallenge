import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindOneMasterTableDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsOptional()
  name?: string;
}
