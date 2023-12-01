import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator'
import { Expose } from 'class-transformer'
import { TransactionStatus } from '@prisma/client'

registerEnumType(TransactionStatus, {
    name: 'TransactionStatus',
});

@InputType()
export class CreateTransactionInput {
    @Field({ name: 'account_external_id_debit' })
    @Expose({ name: 'account_external_id_debit' })
    @IsDefined()
    account_external_id_debit: string

    @Field({ name: 'account_external_id_credit' })
    @Expose({ name: 'account_external_id_credit' })
    @IsDefined()
    account_external_id_credit: string

    @Field(type => Int, { name: 'tranfer_type_id' })
    @Expose({ name: 'tranfer_type_id' })
    @IsDefined()
    tranfer_type_id: number

    @Field(type => Int, { name: 'value' })
    @Expose({ name: 'value' })
    @IsDefined()
    value: number
}

@InputType()
export class SearchTransactionsQuery {
    @Field(type => [Int], { nullable: true })
    @IsNumber({}, { each: true })
    ids?: number[]

    @Field(() => [TransactionStatus], { nullable: true })
    @IsEnum(TransactionStatus, { each: true })
    status?: TransactionStatus[];
}