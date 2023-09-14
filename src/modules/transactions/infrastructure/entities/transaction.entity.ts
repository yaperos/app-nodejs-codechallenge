import { AfterInsert, Column, Entity } from 'typeorm';
import { CoreORMEntity } from './core-orm.entity';
import { StatusTransactions } from '../../domain/enums/status.enum';
import { Transaction } from '../../domain/entities/transaction';
import { Identifier } from '../../domain/value-objects/identifier';
import { DomainEvents } from '../../domain/events/domain-events-handler';

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

  @Column({ type: 'enum', enum: StatusTransactions, name: 'status' })
  status: StatusTransactions;

  constructor(aggregate?: Transaction) {
    super();
    if (aggregate !== undefined) {
      this.id = aggregate.id.toString();
      this.accountExternalIdDebit = aggregate.accountExternalIdDebit;
      this.accountExternalIdCredit = aggregate.accountExternalIdCredit;
      this.tranferTypeId = aggregate.tranferTypeId;
      this.value = aggregate.value;
      this.status = aggregate.status;
    }
  }

  @AfterInsert()
  dispatchAggregateEvents() {
    const aggregateId = new Identifier(this.id);
    DomainEvents.dispatchEventsForAggregate(aggregateId);
  }
}
