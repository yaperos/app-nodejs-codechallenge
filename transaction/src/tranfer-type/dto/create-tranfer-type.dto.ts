import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTranferTypeDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
