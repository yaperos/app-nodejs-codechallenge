import { DomainEventSubscriber } from '../../../../Shared/domain/DomainEventSubscriber';
import { DomainEventClass } from '../../../../Shared/domain/DomainEvent';
import { TransactionCreated } from '../../domain/TransactionCreated';
import { UpdateTransaction } from './UpdateTransaction';

export default class UpdateTransactionOnTransactionCreatedSubscriber
    implements DomainEventSubscriber<TransactionCreated>{
    constructor(private readonly updateTransaction: UpdateTransaction) { }
    async on(domainEvent: TransactionCreated): Promise<void> {
        console.log('=====> Llego el evento <====');
        const amount = domainEvent.getValue()
        amount > 1000 ?
            await this.updateTransaction.run({ transactionId: domainEvent.getId(), transactionStatus: 3 })
            : await this.updateTransaction.run({ transactionId: domainEvent.getId(), transactionStatus: 2 })
        console.log('=====> termino el evento <====');
    }

    subscribedTo(): Array<DomainEventClass> {
        return [TransactionCreated];
    }
}
