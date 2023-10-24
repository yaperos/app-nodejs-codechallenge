import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Transaction } from 'src/transaction/entities/models/transaction.model';

@ObjectType()
export class TransactionType {

    @Field(() => ID, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [Transaction], {nullable:true})
    transactions?: Array<Transaction>;

    static DEFAULT_FIELDS = {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true
    }

    static MODEL_NAME = Prisma.ModelName.TransactionType;
}
