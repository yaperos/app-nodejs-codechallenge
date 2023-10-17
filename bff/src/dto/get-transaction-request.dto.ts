import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTransactionRequest {
  @ApiProperty({ example: '5a5ace62-12f2-47c5-bc31-3c65e0458777' })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
