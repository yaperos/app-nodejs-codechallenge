import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: "transaction_command_db.public.transactions"})
export class TransactionEntity {
    @PrimaryColumn({name: "transaction_external_id"})
    transactionExternalId: string;

    @Column({name: "account_external_id_debit"})
    accountExternalIdDebit: string;

    @Column({name: "account_external_id_credit"})
    accountExternalIdCredit: string;

    @Column({name: "tranfer_type_id"})
    tranferTypeId: number;

    @Column({name: "value"})
    value: number;

    @Column({name: "status"})
    status: string;

    @Column({name: "create_at"})
    createdAt: Date;
}