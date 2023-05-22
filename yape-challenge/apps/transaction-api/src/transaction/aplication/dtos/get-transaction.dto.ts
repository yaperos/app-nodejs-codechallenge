import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetTransactionDTO {

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
    tranferTypeId: number;

	@ApiProperty()
	@IsNotEmpty()
	transactionStatus: string;

	@ApiProperty()
    @IsNotEmpty()
    @IsString()
	createdAt: string;
}
