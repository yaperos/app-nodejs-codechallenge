import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { GraphQLUUID } from 'graphql-scalars';
import { TransactionType } from 'src/transaction-type/entities/models/transaction-type.model';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionStatusType } from './transaction-status.model';

@ObjectType()
export class Transaction {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => GraphQLUUID, {nullable:false})
    accountExternalIdDebit!: string;

    @Field(() => GraphQLUUID, {nullable:false})
    accountExternalIdCredit!: string;

    @Field(() => Int, {nullable:false})
    transactionTypeId!: number;

    @Field(() => Float, {nullable:false})
    value!: number;

    @Field(() => TransactionStatusType, {nullable:false})
    transactionStatus!: keyof typeof TransactionStatus;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => TransactionType, {nullable:false})
    transactionType?: TransactionType;

    static DEFAULT_FIELDS = {
        id: true,
        accountExternalIdDebit: true,
        accountExternalIdCredit: true,
        transactionTypeId: true,
        value: true,
        transactionStatus: true,
        createdAt: true,
        updatedAt: true,
        transactionType: true,
    }

    static MODEL_NAME = Prisma.ModelName.Transaction;

}
