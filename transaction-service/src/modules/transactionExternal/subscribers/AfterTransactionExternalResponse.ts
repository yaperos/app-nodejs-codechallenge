import { DomainEvents, IDomainEvent, IHandle } from "clean-common-lib";
import { TransactionExternalResponseEvent } from "../../notification/domain";
import { UpdateTransactionExternalStatus } from "../useCases/updateTransactionExternalStatus/UpdateTransactionExternalStatus";

export class AfterTransactionExternalResponse
  implements IHandle<TransactionExternalResponseEvent>
{
  private updateTransactionExternalStatus: UpdateTransactionExternalStatus;
  constructor(
    updateTransactionExternalStatus: UpdateTransactionExternalStatus
  ) {
    this.setupSubscription();
    this.updateTransactionExternalStatus = updateTransactionExternalStatus;
  }

  setupSubscription(): void {
    DomainEvents.register(
      this.onTransactionExternalResponseEvent.bind(this),
      TransactionExternalResponseEvent.name
    );
  }

  private async onTransactionExternalResponseEvent(event: IDomainEvent) {
    const { data } = event as TransactionExternalResponseEvent;
    try {
      this.updateTransactionExternalStatus.execute(data);
    } catch (error) {
      console.log(error);
    }
  }
}
