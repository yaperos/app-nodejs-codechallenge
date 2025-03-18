import { IsNumber } from 'class-validator';

export class FindFirstMasterTableDto {
  @IsNumber()
  parentId: number;
}
