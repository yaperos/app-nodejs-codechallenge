import { IsEmail, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePaymentDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsUUID()
    @IsNotEmpty()
    accountExternalIdDebit: string;

    @IsUUID()
    @IsNotEmpty()
    accountExternalIdCredit: string;

    @IsNumber()
    @IsNotEmpty()
    tranferTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}
