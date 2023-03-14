import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class GetOneTransactionParam {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
