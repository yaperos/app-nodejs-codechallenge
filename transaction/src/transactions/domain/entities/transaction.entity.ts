import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column,CreateDateColumn,Entity,PrimaryColumn,PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "transactions"
})
@ObjectType()
export class TransactionEntity{

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    @Field()
    id:number

    @Column('bigint')
    @Field()
    accountExternalId: number

    @Column('int')
    typeAccount: number
    
    @Column('int')
    @Field({nullable:true})
    transferTypeId: number
    
    @Column('int')
    @Field((type)=>Int)
    value: number

    @Column('varchar')
    @Field()
    status: string

    @CreateDateColumn()
    createdAt: Date
}