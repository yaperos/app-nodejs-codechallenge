import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity({ name: 'transaction_query_db.transactions' })
export class TransactionDocument {
    @ObjectIdColumn({name: "_id"})
    _id: string;

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