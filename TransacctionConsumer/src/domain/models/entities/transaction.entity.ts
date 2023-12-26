import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * @author RRG
 */
@Entity({ name: 'transaction' })
export class Transaction {

    @PrimaryGeneratedColumn('increment')
    id: number;


    @Column("varchar", { name: "accountexternaliddebit" })
    accountExternalIdDebit: string

    @Column("varchar", { name: "accountexternalidcredit" })
    accountExternalIdCredit: string


    @Column("integer", { name: "tranfertypeid" })
    tranferTypeId: number

    @Column('integer')
    value: number

    @Column('integer')
    status: number

    @Column("varchar" , { name: "createdat" })
    createdAt: string
}