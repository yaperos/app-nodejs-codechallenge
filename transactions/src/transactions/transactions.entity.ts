import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "transactions"})
export default class TransactionsEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    transaction_external_id:string;

    @Column({nullable:false})
    account_external_id_debit:string;

    @Column({nullable:false})
    account_external_id_credit:string;

    @Column({nullable:false})
    transactionType:string;

    @Column({nullable:false})
    transaction_status:string;

    @Column({nullable:false})
    value:number;

    @Column({nullable:false})
    created_At:string;

    @Column({nullable:true})
    modified_At:string;
    
}