import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TransactionCreateDto{

    @ApiProperty({
        example: 123456789,
        description: 'Debes ser el numero de cuenta del cliente',
        required:true
    })
    @IsNotEmpty({message:'El numero de cuenta es obligatorio'})
    @IsNumber()
    @Field()
    accountExternalIdDebit: number

    @ApiProperty({
        example: 123456789,
        description: 'Debes ser el numero de cuenta del cliente',
        required:true
    })
    @IsNotEmpty({message:'El numero de cuenta es obligatorio'})
    @IsNumber()
    @Field()
    accountExternalIdCredit: number

    @ApiProperty({
        example: 1,
        description: 'Debe ser el tipo de cuenta del cliente',
        required:true
    })
    @IsNotEmpty({message:'El tipo de cuenta es obligatorio'})
    @IsNumber()
    @Min(1)
    typeAcount: number

    @ApiProperty({
        example: 1,
        description: 'Debe ser el tipo de transferencia',
        required:true
    })
    @IsNotEmpty({message:'El tipo de transferencia es obligatorio'})
    @IsNumber()
    @Min(1)
    @Field()
    transferTypeId: number

    @ApiProperty({
        example: 1,
        description: 'Debe ser el valor de la transferencia',
        required:true
    })
    @IsNotEmpty({message:'El valor de la transferencia es obligatorio'})
    @IsNumber()
    @Min(1)
    @Field()
    value: number
}