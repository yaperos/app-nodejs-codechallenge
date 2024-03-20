import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ParamsWithId {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  public id: string;
}
