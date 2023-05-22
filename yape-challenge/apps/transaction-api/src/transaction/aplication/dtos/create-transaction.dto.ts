import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsUUID} from 'class-validator';

export class CreateTransactionDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsUUID()
	accountExternalIdDebit: string;

    @ApiProperty()
	@IsNotEmpty()
    @IsString()
    @IsUUID()
    accountExternalIdCredit: string;

    @ApiProperty()
	@IsNotEmpty()
    @IsNumber()
	tranferTypeId: number;

    @ApiProperty()
	@IsNotEmpty()
    @IsNumber()
	value: number;
}
