import { Status } from "../../common/constants/status.constant";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name: "transaction"})
export class Transaction extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'transaction_external_id'})
    transactionExternalId: string;
    
    @Column({name: 'account_external_id_debit'})
    accountExternalIdDebit: string;

    @Column({name: 'account_external_id_credit'})
    accountExternalIdCredit: string;

    @Column({name: 'tranfer_type_id'})
    tranferTypeId: number;

    @Column()
    value: number;

    @Column({default: Status.PENDING})
    status: string;

    @Column({name: 'created_at'})
    createdAt: Date;

    @Column({name: 'updated_at', nullable: true})
    updatedAt? : Date = null
}