import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm";

@ObjectType()
export class Info {
    @Field()
    name: string
}

@ObjectType()
@Entity({ name: "transaction" })
export class TransactionDoc {

    @ObjectIdColumn()
    @Field(type => String)
    id: ObjectId;

    @Column()
    @Field()
    transactionId: string

    @Column()
    @Field(type => Info)
    transactionType: { name: string }

    @Column()
    @Field(type => Info)
    transactionStatus: { name: string }

    @Column()
    @Field()
    value: number

    @Column()
    @Field()
    createdAt: Date
}
