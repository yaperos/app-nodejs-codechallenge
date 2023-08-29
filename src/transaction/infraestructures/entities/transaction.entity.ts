import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
//import { BaseEntity } from "./base.entity";

@Entity('Transactions')
export class TransactionEntity extends BaseEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar',{length:36})
    accountExternalIdDebit: string;

    @Column('varchar',{length:36})
    accountExternalIdCredit: string;

    @Column('smallint')
    tranferTypeId:number;

    @Column({type:'decimal',precision:10, scale:2})
    value: number;
}