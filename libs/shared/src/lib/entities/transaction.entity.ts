import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("transaction")
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid', {
        name: 'transaction_id'
    })
    transactionId: string;

    @Column("int", {
        name: "transfer_type_id",
        nullable: false
    })
    tranferTypeId: number;

    @Column("uuid", {
        name: "account_external_id_debit",
        nullable: false
    })
    accountExternalIdDebit: string;

    @Column("uuid", {
        name: "account_external_id_credit",
        nullable: false
    })
    accountExternalIdCredit: string;

    @Column("money", {
        name: "value",
        nullable: false,
    })
    value: number;

    @Column("varchar", {
        name: "status",
        nullable: false,
        length: 16
    })
    status: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;


}