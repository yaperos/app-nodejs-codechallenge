import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';

/** Request body matches README spelling `tranferTypeId`. */
export class CreateTransactionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  accountExternalIdDebit: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  accountExternalIdCredit: string;

  @ApiProperty({ example: 1, description: 'Transfer type id (README field name)' })
  @IsInt()
  @Min(1)
  tranferTypeId: number;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(0)
  value: number;
}
