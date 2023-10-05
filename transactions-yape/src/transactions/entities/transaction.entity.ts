import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    transactionId: number;

    @Column()
    status:string;

    @Column()
    createdAt:Date;

    @Column() 
    accountExternalIdDebit:string;

    @Column()
    accountExternalIdCredit:string;

    @Column() 
    tranferTypeId:number;

    @Column()
    value:number;

}
