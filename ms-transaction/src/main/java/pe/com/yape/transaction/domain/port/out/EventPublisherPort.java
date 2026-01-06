package pe.com.yape.transaction.domain.port.out;

import pe.com.yape.transaction.domain.events.TransactionCreatedEvent;

public interface EventPublisherPort {

    void publishTransactionCreated(TransactionCreatedEvent event);
}
