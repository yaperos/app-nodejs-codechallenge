import { Column, Entity } from 'typeorm';
import { CoreORMEntity } from '../../core/entity-base/core-orm.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity extends CoreORMEntity {
  @Column({ type: 'varchar', name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ type: 'varchar', name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Column({ type: 'int', name: 'tranfer_type_id' })
  tranferTypeId: number;

  @Column({ type: 'int', name: 'value' })
  value: number;

  @Column({ type: 'varchar', name: 'status', default: 'Pending' })
  status: string;
}
