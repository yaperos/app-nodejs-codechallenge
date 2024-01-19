import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID, Max, Min } from 'class-validator';
import { CreateTransactionInput as ICreateTransactionInput } from 'src/modules/transaction/domain/providers/transaction-client.provider';

const TRANSFER_TYPE_ID_RANGE_MESSAGE = 'Transfer type must be 1 , 2 or 3';

export class CreateTransactionRequestDto implements ICreateTransactionInput {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Guid',
    example: '7847c08f-80ad-4d28-a372-3e3993288b45',
    nullable: false,
    required: true,
  })
  @IsUUID()
  readonly accountExternalIdCredit: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Guid',
    example: '77c0fea4-38c7-47af-a8ba-0f50dd10138b',
    nullable: false,
    required: true,
  })
  @IsUUID()
  readonly accountExternalIdDebit: string;

  @ApiProperty({
    type: 'number',
    format: 'integer',
    example: '2',
    nullable: false,
    required: true,
    minimum: 1,
    maximum: 3,
  })
  @IsNumber()
  @Min(1, { message: TRANSFER_TYPE_ID_RANGE_MESSAGE })
  @Max(3, { message: TRANSFER_TYPE_ID_RANGE_MESSAGE })
  readonly tranferTypeId: number;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 520.5,
    nullable: false,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  readonly value: number;
}
